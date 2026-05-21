import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('admin_session')?.value
  return !!sessionCookie && sessionCookie === process.env.ADMIN_SECRET
}

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
