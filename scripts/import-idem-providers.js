#!/usr/bin/env node
/**
 * Import Indiana IDEM certified backflow testers from Excel file.
 * Reads both sheets (WithContact + NoContact), deduplicates by business name,
 * collects service areas per business, then bulk-inserts to Supabase.
 *
 * Usage: node scripts/import-idem-providers.js [path-to-xlsx]
 */

require('dotenv').config({ path: '.env.local' })
const xlsx = require('xlsx')
const https = require('https')

const XLSX_PATH = process.argv[2] || '/Users/katrinacolvin/Downloads/backflow_testers_contact_info.xlsx'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractEmail(text) {
  const m = text.match(/[\w._%+\-]+@[\w.\-]+\.[a-z]{2,}/i)
  return m ? m[0].toLowerCase() : null
}

function extractPhone(text) {
  // Remove email first to avoid false positives
  const clean = text.replace(/[\w._%+\-]+@[\w.\-]+\.[a-z]{2,}/gi, '')
  const m = clean.match(/(?:\(\d{3}\)\s*\d{3}[-.\s]\d{4}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/)
  if (!m) return null
  return m[0].replace(/[^\d]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
}

function extractZip(text) {
  const m = text.match(/\b(4[0-9]{4})\b/) // Indiana ZIPs start with 4
  return m ? m[1] : null
}

function parseBusinessAddress(raw) {
  if (!raw || !raw.trim()) return { businessName: '', phone: null, email: null, address: null, zip: null }

  const email = extractEmail(raw)
  const phone = extractPhone(raw)
  const zip = extractZip(raw)

  // Strip email/phone/zip/state suffixes for name parsing
  let text = raw
    .replace(/[\w._%+\-]+@[\w.\-]+\.[a-z]{2,}/gi, '')
    .replace(/(?:\(\d{3}\)\s*\d{3}[-.\s]\d{4}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/g, '')
    .replace(/\b4[0-9]{4}\b/g, '')
    .replace(/,?\s*\bIN\b\.?/gi, '')
    .replace(/,?\s*\bIndiana\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  // Business name = everything before first street number (e.g. "123 Main St")
  const addrIdx = text.search(/\b\d{1,5}\s+[A-Za-z]/)
  let businessName, address

  if (addrIdx > 2) {
    businessName = text.slice(0, addrIdx).replace(/[,.\s]+$/, '').trim()
    address = text.slice(addrIdx).replace(/[,\s]+$/, '').trim()
  } else if (addrIdx === 0) {
    // Starts with address — no business name prefix
    businessName = ''
    address = text.trim()
  } else {
    // No street number — full text is business name or tester name
    businessName = text.replace(/[,.\s]+$/, '').trim()
    address = null
  }

  return { businessName, phone, email, address, zip }
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').trim()
}

function formatTesterName(raw) {
  if (!raw) return null
  // "LastName, FirstName" → "FirstName LastName"
  const parts = raw.split(',').map(s => s.trim())
  if (parts.length >= 2) return `${parts[1]} ${parts[0]}`.trim()
  return raw.trim()
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL)
    const options = {
      hostname: url.hostname,
      path: `/rest/v1${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : {})
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`))
        }
      })
    })
    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Reading: ${XLSX_PATH}`)
  const wb = xlsx.readFile(XLSX_PATH)

  const allRows = []
  for (const sheetName of wb.SheetNames) {
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' })
    rows.forEach(r => allRows.push({ ...r, _sheet: sheetName }))
  }
  console.log(`Total rows: ${allRows.length} (${wb.SheetNames.join(', ')})`)

  // ── Parse & group by normalized business name ──────────────────────────────
  const businessMap = new Map() // normalizedKey → business object

  for (const row of allRows) {
    const rawBiz = String(row['Business_Address_etc'] || '').trim()
    const rawCity = String(row['City'] || '').trim()
    const rawCounty = String(row['County'] || '').trim()
    const rawTester = String(row['Tester Name'] || '').trim()
    const cert = String(row['Certification'] || '').trim()

    const parsed = parseBusinessAddress(rawBiz)

    // Determine canonical business name
    let bizName = parsed.businessName
    if (!bizName) {
      // Solo tester — use tester name as business
      bizName = formatTesterName(rawTester) || 'Unknown'
    }

    const key = normalizeName(bizName)
    if (!key) continue

    if (!businessMap.has(key)) {
      businessMap.set(key, {
        business_name: bizName,
        phone: parsed.phone,
        email: parsed.email,
        address: parsed.address,
        zip: parsed.zip,
        testers: [],
        cities: new Set(),
        counties: new Set(),
        certifications: new Set(),
      })
    }

    const biz = businessMap.get(key)

    // Merge contact info — prefer non-null values
    if (!biz.phone && parsed.phone) biz.phone = parsed.phone
    if (!biz.email && parsed.email) biz.email = parsed.email
    if (!biz.address && parsed.address) biz.address = parsed.address
    if (!biz.zip && parsed.zip) biz.zip = parsed.zip

    if (rawTester) biz.testers.push(formatTesterName(rawTester))
    if (rawCity) biz.cities.add(rawCity)
    if (rawCounty) biz.counties.add(rawCounty)
    if (cert) biz.certifications.add(cert)
  }

  console.log(`Unique businesses: ${businessMap.size}`)

  // ── Build Supabase insert payload ─────────────────────────────────────────
  const providers = []
  const slugCounts = new Map()

  for (const [, biz] of businessMap) {
    const baseSlug = toSlug(biz.business_name).slice(0, 80)
    const count = (slugCounts.get(baseSlug) || 0) + 1
    slugCounts.set(baseSlug, count)
    const slug = count === 1 ? baseSlug : `${baseSlug}-${count}`

    const serviceAreas = Array.from(biz.cities).filter(Boolean).sort()
    const counties = Array.from(biz.counties).filter(Boolean)
    const primaryCity = serviceAreas[0] || null
    const primaryCounty = counties[0] || null

    // Primary tester name as contact
    const contactName = [...new Set(biz.testers)].slice(0, 3).join(', ') || null

    // Primary cert number (most recent = highest BF year)
    const certs = Array.from(biz.certifications).sort().reverse()
    const licenseNumber = certs[0] || null

    providers.push({
      business_name: biz.business_name,
      provider_slug: slug,
      contact_name: contactName,
      license_number: licenseNumber,
      certification_type: 'IDEM Certified Backflow Tester',
      phone: biz.phone,
      email: biz.email,
      address: biz.address,
      city: primaryCity,
      state: 'IN',
      zip: biz.zip,
      county: primaryCounty,
      service_areas: serviceAreas,
      service_types: [],
      is_verified: true,
      is_featured: false,
      is_active: true,
      source_name: 'IDEM',
      source_url: 'https://www.in.gov/idem/',
    })
  }

  console.log(`Inserting ${providers.length} providers in batches...`)

  // ── Batch insert (100 at a time) ──────────────────────────────────────────
  const BATCH = 100
  let inserted = 0
  let errors = 0

  for (let i = 0; i < providers.length; i += BATCH) {
    const batch = providers.slice(i, i + BATCH)
    try {
      await supabaseRequest('POST', '/providers?on_conflict=provider_slug', batch)
      inserted += batch.length
      process.stdout.write(`\r  Inserted ${inserted}/${providers.length}...`)
    } catch (err) {
      errors++
      console.error(`\nBatch ${i}-${i + BATCH} error:`, err.message.slice(0, 200))
    }
  }

  console.log(`\n\nDone! ${inserted} providers inserted, ${errors} batch errors.`)
  console.log('\nTop service area coverage:')
  const cityCount = {}
  for (const p of providers) {
    for (const city of p.service_areas) {
      cityCount[city] = (cityCount[city] || 0) + 1
    }
  }
  Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([city, n]) => console.log(`  ${city}: ${n} providers`))
}

main().catch(e => { console.error(e); process.exit(1) })
