/**
 * Validate provider data before import.
 * Usage: npx tsx scripts/validate-provider-data.ts --source=./data/providers.json
 */
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

interface RawProvider {
  business_name?: string
  phone?: string
  email?: string
  website?: string
  source_url?: string
  source_name?: string
  license_number?: string
  city?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length >= 10
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

async function validate(filePath: string) {
  const records: RawProvider[] = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const issues: Array<{ record: RawProvider; issues: string[] }> = []

  for (const r of records) {
    const recordIssues: string[] = []

    if (!r.business_name) recordIssues.push('Missing business_name')
    if (!r.source_url) recordIssues.push('Missing source_url')
    if (!r.source_name) recordIssues.push('Missing source_name')
    if (r.email && !isValidEmail(r.email)) recordIssues.push(`Invalid email: ${r.email}`)
    if (r.phone && !isValidPhone(r.phone)) recordIssues.push(`Invalid phone: ${r.phone}`)
    if (r.website && !isValidUrl(r.website)) recordIssues.push(`Invalid website: ${r.website}`)
    if (r.source_url && !isValidUrl(r.source_url)) recordIssues.push(`Invalid source_url: ${r.source_url}`)

    if (recordIssues.length > 0) {
      issues.push({ record: r, issues: recordIssues })
    }
  }

  console.log(`Validated ${records.length} records.`)
  if (issues.length === 0) {
    console.log('✓ All records are valid.')
  } else {
    console.log(`\n⚠ ${issues.length} records have issues:\n`)
    issues.forEach(({ record, issues }) => {
      console.log(`  ${record.business_name || '(unnamed)'} — ${issues.join(', ')}`)
    })

    const outputPath = path.join(path.dirname(filePath), 'validation-errors.json')
    fs.writeFileSync(outputPath, JSON.stringify(issues, null, 2))
    console.log(`\nFull report saved to ${outputPath}`)
  }
}

const sourceArg = process.argv.find((a) => a.startsWith('--source='))
const sourcePath = sourceArg?.split('=')[1]
if (!sourcePath) {
  console.error('Usage: npx tsx scripts/validate-provider-data.ts --source=./data/providers.json')
  process.exit(1)
}

validate(path.resolve(sourcePath)).catch(console.error)
