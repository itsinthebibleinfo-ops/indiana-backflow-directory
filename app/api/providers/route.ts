import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ providers: [] })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('providers')
    .select('id, business_name, provider_slug, city, county, is_verified')
    .ilike('business_name', `%${q}%`)
    .limit(10)

  if (error) {
    return NextResponse.json({ providers: [] })
  }

  return NextResponse.json({ providers: data })
}
