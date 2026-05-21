import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  const supabase = await createClient()
  let query = supabase.from('cities').select('id, name, slug, county').order('name')

  if (q && q.length >= 1) {
    query = query.ilike('name', `${q}%`)
  }

  const { data } = await query.limit(20)
  return NextResponse.json({ cities: data || [] })
}
