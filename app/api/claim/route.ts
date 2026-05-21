import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import slugify from 'slugify'

const claimSchema = z.object({
  provider_id: z.string().uuid().nullable().optional(),
  requester_name: z.string().min(1).max(100),
  requester_email: z.string().email(),
  requester_phone: z.string().max(30).optional(),
  verification_document_url: z.string().url().optional().or(z.literal('')),
  is_new_listing: z.boolean().optional(),
  // New listing fields
  business_name: z.string().max(200).optional(),
  license_number: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  website: z.string().url().optional().or(z.literal('')),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = claimSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 422 })
  }

  const data = parsed.data
  const supabase = createAdminClient()

  let providerId = data.provider_id || null

  // Create a new placeholder provider if this is a new listing
  if (data.is_new_listing && data.business_name) {
    const providerSlug = slugify(data.business_name, { lower: true, strict: true })

    const { data: newProvider, error: providerError } = await supabase
      .from('providers')
      .insert({
        business_name: data.business_name,
        provider_slug: `${providerSlug}-${Date.now()}`,
        license_number: data.license_number || null,
        city: data.city || null,
        phone: data.phone || null,
        website: data.website || null,
        is_active: false, // Not active until approved
        is_verified: false,
        source_name: 'claim_request',
      })
      .select('id')
      .single()

    if (providerError) {
      console.error('[claim] Provider insert error:', providerError)
      return NextResponse.json({ error: 'Failed to create listing. Please try again.' }, { status: 500 })
    }

    providerId = newProvider.id
  }

  const { error } = await supabase.from('claim_requests').insert({
    provider_id: providerId,
    requester_name: data.requester_name,
    requester_email: data.requester_email,
    requester_phone: data.requester_phone || null,
    verification_document_url: data.verification_document_url || null,
    status: 'pending',
  })

  if (error) {
    console.error('[claim] Insert error:', error)
    return NextResponse.json({ error: 'Failed to submit claim. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
