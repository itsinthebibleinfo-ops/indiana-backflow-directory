import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, buildLeadNotificationHtml } from '@/lib/email/adapter'

const leadSchema = z.object({
  customer_name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  service_address: z.string().max(200).optional(),
  property_type: z.string().max(50).optional(),
  device_type: z.string().max(50).optional(),
  urgency: z.string().max(50).optional(),
  preferred_contact_method: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
  city_id: z.string().uuid().optional().or(z.literal('')),
  city_name: z.string().max(100).optional(),
})

// Simple in-memory rate limiter (per IP, resets on restart)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please fill in all required fields.', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const data = parsed.data
  const supabase = createAdminClient()

  // Resolve city_id from city_name if not provided
  let cityId = data.city_id || null
  if (!cityId && data.city_name) {
    const slug = data.city_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { data: city } = await supabase.from('cities').select('id').eq('slug', slug).single()
    cityId = city?.id || null
  }

  const { error } = await supabase.from('leads').insert({
    customer_name: data.customer_name,
    email: data.email || null,
    phone: data.phone || null,
    service_address: data.service_address || null,
    property_type: data.property_type || null,
    device_type: data.device_type || null,
    urgency: data.urgency || null,
    preferred_contact_method: data.preferred_contact_method || null,
    message: data.message || null,
    city_id: cityId,
    status: 'new',
  })

  if (error) {
    console.error('[leads] Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to save your request. Please try again.' }, { status: 500 })
  }

  // Fire-and-forget email notification
  const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL
  if (notifyEmail) {
    sendEmail({
      to: notifyEmail,
      subject: `New Backflow Lead: ${data.customer_name} — ${data.city_name || 'Indiana'}`,
      html: buildLeadNotificationHtml({
        customer_name: data.customer_name,
        email: data.email,
        phone: data.phone,
        city: data.city_name,
        property_type: data.property_type,
        device_type: data.device_type,
        urgency: data.urgency,
        message: data.message,
      }),
    }).catch((e) => console.error('[leads] Email notification failed:', e))
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
