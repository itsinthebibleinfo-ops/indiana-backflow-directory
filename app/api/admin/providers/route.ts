import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('admin_session')?.value
  return !!sessionCookie && sessionCookie === process.env.ADMIN_SECRET
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const providerSchema = z.object({
  business_name: z.string().min(1).max(200),
  contact_name: z.string().max(100).optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  zip: z.string().max(10).optional().or(z.literal('')),
  county: z.string().max(100).optional().or(z.literal('')),
  license_number: z.string().max(100).optional().or(z.literal('')),
  certification_type: z.string().max(100).optional().or(z.literal('')),
  service_areas: z.array(z.string()).optional(),
  service_types: z.array(z.string()).optional(),
  is_verified: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
  verification_notes: z.string().max(1000).optional().or(z.literal('')),
})

// ── POST — create a new provider ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = providerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
  }

  const data = parsed.data
  const supabase = createAdminClient()

  // Generate a unique slug
  const baseSlug = toSlug(data.business_name)
  let slug = baseSlug
  let attempt = 0
  while (true) {
    const { data: existing } = await supabase
      .from('providers')
      .select('id')
      .eq('provider_slug', slug)
      .maybeSingle()
    if (!existing) break
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const { data: provider, error } = await supabase
    .from('providers')
    .insert({
      business_name: data.business_name,
      provider_slug: slug,
      contact_name: data.contact_name || null,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      address: data.address || null,
      city: data.city || null,
      state: 'IN',
      zip: data.zip || null,
      county: data.county || null,
      license_number: data.license_number || null,
      certification_type: data.certification_type || null,
      service_areas: data.service_areas || [],
      service_types: data.service_types || [],
      is_verified: data.is_verified ?? false,
      is_featured: data.is_featured ?? false,
      is_active: data.is_active ?? true,
      verification_notes: data.verification_notes || null,
      source_name: 'admin',
    })
    .select('id, provider_slug')
    .single()

  if (error) {
    console.error('[admin/providers POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, provider }, { status: 201 })
}

// ── PATCH — toggle is_verified / is_featured / is_active ─────────────────────
export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, ...fields } = await request.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const allowed = ['is_verified', 'is_featured', 'is_active']
  const update: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in fields) update[key] = fields[key]
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('providers').update(update).eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
