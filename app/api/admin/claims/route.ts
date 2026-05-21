import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(request: NextRequest): boolean {
  return request.cookies.get('admin_session')?.value === process.env.ADMIN_SECRET
}

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status, provider_id } = await request.json()
  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from('claim_requests').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If approving, activate the linked provider
  if (status === 'approved' && provider_id) {
    await supabase
      .from('providers')
      .update({ is_active: true })
      .eq('id', provider_id)
  }

  return NextResponse.json({ success: true })
}
