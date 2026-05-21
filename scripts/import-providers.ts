/**
 * Import providers from a local JSON or CSV source.
 *
 * Usage:
 *   npx tsx scripts/import-providers.ts --source ./data/providers.json
 *   npx tsx scripts/import-providers.ts --source ./data/providers.csv
 *
 * Data ethics: Only import public, official, or provider-submitted data.
 * Each record MUST include source_url and source_name.
 */
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface RawProvider {
  business_name: string
  contact_name?: string
  license_number?: string
  certification_type?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  city?: string
  zip?: string
  county?: string
  service_areas?: string[]
  service_types?: string[]
  source_url: string
  source_name: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

async function generateUniqueSlug(base: string): Promise<string> {
  const slug = slugify(base)
  const { data } = await supabase
    .from('providers')
    .select('provider_slug')
    .ilike('provider_slug', `${slug}%`)

  const existing = new Set((data || []).map((r: { provider_slug: string }) => r.provider_slug))
  if (!existing.has(slug)) return slug

  let i = 2
  while (existing.has(`${slug}-${i}`)) i++
  return `${slug}-${i}`
}

async function importProviders(filePath: string) {
  const ext = path.extname(filePath).toLowerCase()
  let records: RawProvider[] = []

  if (ext === '.json') {
    records = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } else if (ext === '.csv') {
    // Simple CSV parser — assumes header row
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean)
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
    records = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/"/g, ''))
      return Object.fromEntries(headers.map((h, i) => [h, values[i] || ''])) as unknown as RawProvider
    })
  } else {
    throw new Error(`Unsupported file format: ${ext}. Use .json or .csv`)
  }

  console.log(`Importing ${records.length} providers from ${filePath}…\n`)
  const uncertain: RawProvider[] = []

  for (const raw of records) {
    if (!raw.business_name) {
      console.warn('⚠ Skipping record with no business_name:', raw)
      uncertain.push(raw)
      continue
    }

    if (!raw.source_url || !raw.source_name) {
      console.warn(`⚠ Missing source info for ${raw.business_name} — flagging for manual review`)
      uncertain.push(raw)
      continue
    }

    const providerSlug = await generateUniqueSlug(raw.business_name)

    const { error } = await supabase.from('providers').insert({
      business_name: raw.business_name.trim(),
      provider_slug: providerSlug,
      contact_name: raw.contact_name?.trim() || null,
      license_number: raw.license_number?.trim() || null,
      certification_type: raw.certification_type?.trim() || null,
      phone: raw.phone ? normalizePhone(raw.phone) : null,
      email: raw.email?.trim().toLowerCase() || null,
      website: raw.website?.trim() || null,
      address: raw.address?.trim() || null,
      city: raw.city?.trim() || null,
      state: 'IN',
      zip: raw.zip?.trim() || null,
      county: raw.county?.trim() || null,
      service_areas: raw.service_areas || (raw.city ? [raw.city] : []),
      service_types: raw.service_types || [],
      is_verified: false,
      is_featured: false,
      is_active: true,
      source_url: raw.source_url,
      source_name: raw.source_name,
    })

    if (error) {
      if (error.code === '23505') {
        console.log(`  Duplicate: ${raw.business_name} — skipped`)
      } else {
        console.error(`  Error importing ${raw.business_name}:`, error.message)
        uncertain.push(raw)
      }
    } else {
      console.log(`  ✓ ${raw.business_name} (${raw.city || 'unknown city'})`)
    }
  }

  if (uncertain.length > 0) {
    const reviewPath = path.join(path.dirname(filePath), 'manual-review.json')
    fs.writeFileSync(reviewPath, JSON.stringify(uncertain, null, 2))
    console.log(`\n⚠ ${uncertain.length} records need manual review → ${reviewPath}`)
  }

  console.log('\nImport complete.')
}

const sourceArg = process.argv.find((a) => a.startsWith('--source='))
const sourcePath = sourceArg?.split('=')[1]

if (!sourcePath) {
  console.error('Usage: npx tsx scripts/import-providers.ts --source=./data/providers.json')
  process.exit(1)
}

importProviders(path.resolve(sourcePath)).catch(console.error)
