/**
 * Parse IDEM or utility-provided PDFs/CSVs containing certified tester lists.
 *
 * Data ethics: Only run on official/public IDEM data or utility-published tester lists.
 * Do NOT use on private, gated, or copyrighted data without permission.
 *
 * Usage:
 *   npx tsx scripts/parse-idem-pdf.ts --source=./data/certified-testers.csv --output=./data/providers.json
 *
 * Expected CSV columns (flexible — edit fieldMap below for your source):
 *   business_name, contact_name, license_number, city, phone, address, zip
 */
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Map CSV column names to our schema fields
const FIELD_MAP: Record<string, string> = {
  'Company Name': 'business_name',
  'Business Name': 'business_name',
  'Name': 'business_name',
  'Contact': 'contact_name',
  'License Number': 'license_number',
  'Cert Number': 'license_number',
  'Certification': 'license_number',
  'City': 'city',
  'Phone': 'phone',
  'Address': 'address',
  'Zip': 'zip',
  'Zip Code': 'zip',
  'County': 'county',
  'Email': 'email',
  'Website': 'website',
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  if (digits.length === 11 && digits[0] === '1') return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  return phone
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(Boolean)
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || '']))
  })
}

interface ParsedProvider {
  business_name: string
  contact_name?: string
  license_number?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  city?: string
  zip?: string
  county?: string
  source_url: string
  source_name: string
}

async function parseTesterList(sourcePath: string, outputPath: string) {
  const ext = path.extname(sourcePath).toLowerCase()
  if (ext !== '.csv') {
    console.error('Currently only CSV is supported. For PDFs, export to CSV first.')
    process.exit(1)
  }

  const content = fs.readFileSync(sourcePath, 'utf8')
  const rows = parseCSV(content)

  const providers: ParsedProvider[] = []
  const uncertain: Record<string, string>[] = []

  for (const row of rows) {
    const mapped: Record<string, string> = {}
    for (const [csvKey, schemaKey] of Object.entries(FIELD_MAP)) {
      if (row[csvKey]) mapped[schemaKey] = row[csvKey]
    }

    if (!mapped.business_name) {
      uncertain.push(row)
      continue
    }

    providers.push({
      business_name: mapped.business_name.trim(),
      contact_name: mapped.contact_name?.trim(),
      license_number: mapped.license_number?.trim(),
      phone: mapped.phone ? normalizePhone(mapped.phone) : undefined,
      email: mapped.email?.trim().toLowerCase(),
      website: mapped.website?.trim(),
      address: mapped.address?.trim(),
      city: mapped.city?.trim(),
      zip: mapped.zip?.trim(),
      county: mapped.county?.trim(),
      source_url: sourcePath,
      source_name: 'IDEM / Public Tester List',
    })
  }

  fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2))
  console.log(`✓ Parsed ${providers.length} providers → ${outputPath}`)

  if (uncertain.length > 0) {
    const uncertainPath = outputPath.replace('.json', '-uncertain.json')
    fs.writeFileSync(uncertainPath, JSON.stringify(uncertain, null, 2))
    console.log(`⚠ ${uncertain.length} uncertain records → ${uncertainPath}`)
  }
}

const sourceArg = process.argv.find((a) => a.startsWith('--source='))?.split('=')[1]
const outputArg = process.argv.find((a) => a.startsWith('--output='))?.split('=')[1]

if (!sourceArg || !outputArg) {
  console.error('Usage: npx tsx scripts/parse-idem-pdf.ts --source=./data/list.csv --output=./data/providers.json')
  process.exit(1)
}

parseTesterList(path.resolve(sourceArg), path.resolve(outputArg)).catch(console.error)
