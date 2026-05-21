import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProviderCard from '@/components/providers/ProviderCard'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import type { City, Provider } from '@/types'

type Props = { params: Promise<{ 'county-slug': string }> }

function unslugify(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'county-slug': slug } = await params
  const county = unslugify(slug)
  return {
    title: `Backflow Testing in ${county} County, Indiana`,
    description: `Find certified backflow testers in ${county} County, Indiana. Browse licensed providers by city and request a testing quote.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/backflow-testing/indiana/counties/${slug}/`,
    },
  }
}

export default async function CountyPage({ params }: Props) {
  const { 'county-slug': slug } = await params
  const countyName = unslugify(slug)
  const supabase = await createClient()

  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('county', countyName)
    .order('name')

  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .eq('county', countyName)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('is_verified', { ascending: false })
    .limit(20)

  if (!cities || cities.length === 0) notFound()

  return (
    <>
      <section className="bg-[#0f2044] text-white py-10">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Indiana Backflow Testing', href: '/backflow-testing/indiana/' },
              { label: `${countyName} County` },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">
            Backflow Testing in {countyName} County, Indiana
          </h1>
          <p className="text-blue-100">
            Certified backflow testers serving {countyName} County cities and municipalities.
          </p>
        </div>
      </section>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Cities */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Cities in {countyName} County
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(cities as City[]).map((city) => (
                  <Link
                    key={city.id}
                    href={`/backflow-testing/indiana/${city.slug}/`}
                    className="card-hover px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-700"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Providers */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Providers Serving {countyName} County
                {providers && providers.length > 0 && (
                  <span className="ml-2 text-base font-normal text-slate-500">({providers.length})</span>
                )}
              </h2>
              {!providers || providers.length === 0 ? (
                <div className="card p-6 text-slate-500 text-sm">
                  No providers listed for {countyName} County yet.{' '}
                  <Link href="/claim-listing/" className="text-blue-700 underline">Claim your listing.</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(providers as Provider[]).map((p) => (
                    <ProviderCard key={p.id} provider={p} showServiceAreas />
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-blue-700 text-white rounded-xl p-5">
              <h3 className="font-semibold mb-2">Need Testing in {countyName} County?</h3>
              <Link href="/request-backflow-test/" className="block text-center bg-white text-blue-700 font-semibold py-2.5 rounded-lg hover:bg-blue-50 text-sm mt-3">
                Request a Quote
              </Link>
            </div>
            <div className="card p-5">
              <Link href="/backflow-testing/indiana/" className="text-blue-700 hover:underline text-sm">
                ← All Indiana Cities
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
