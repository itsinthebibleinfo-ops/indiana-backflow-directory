import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const reminderSchema = z.object({
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  device_type: z.string().max(50).optional(),
  due_date: z.string().optional(),
  city_id: z.string().uuid().optional().or(z.literal('')),
  city_name: z.string().max(100).optional(),
  consent_to_reminders: z.boolean(),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const parsed = reminderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 422 })
  }

  if (!parsed.data.consent_to_reminders) {
    return NextResponse.json({ error: 'Consent is required.' }, { status: 422 })
  }

  const data = parsed.data
  const supabase = createAdminClient()

  let cityId = data.city_id || null
  if (!cityId && data.city_name) {
    const slug = data.city_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { data: city } = await supabase.from('cities').select('id').eq('slug', slug).single()
    cityId = city?.id || null
  }

  const { error } = await supabase.from('reminders').insert({
    email: data.email,
    phone: data.phone || null,
    device_type: data.device_type || null,
    due_date: data.due_date || null,
    city_id: cityId,
    consent_to_reminders: true,
  })

  if (error) {
    console.error('[remind] Insert error:', error)
    return NextResponse.json({ error: 'Failed to save reminder.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
