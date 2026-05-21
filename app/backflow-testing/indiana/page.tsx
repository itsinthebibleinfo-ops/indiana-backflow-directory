import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { City } from '@/types'

export const metadata: Metadata = {
  title: 'Backflow Testing in Indiana | Certified Tester Directory',
  description:
    'Browse certified backflow testers across Indiana by city, county, or service type. Stay compliant with Indiana IDEM cross-connection control requirements.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/backflow-testing/indiana/`,
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_SITE_URL || '' },
    { '@type': 'ListItem', position: 2, name: 'Indiana Backflow Testing', item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/backflow-testing/indiana/` },
  ],
}

const COUNTIES = [
  'Marion', 'Lake', 'Allen', 'Hamilton', 'St. Joseph',
  'Tippecanoe', 'Elkhart', 'Vigo', 'Delaware', 'Monroe',
  'Johnson', 'Madison', 'Vanderburgh', 'Howard', 'Bartholomew',
]

function slugifyCounty(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function IndianaHubPage() {
  const supabase = await createClient()

  const { data: cities } = await supabase
    .from('cities')
    .select('id, name, slug, county, population')
    .order('population', { ascending: false, nullsFirst: false })

  const cityList: Pick<City, 'id' | 'name' | 'slug' | 'county' | 'population'>[] = cities || []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Hero */}
      <section className="bg-[#0f2044] text-white py-12">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="text-blue-300 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">›</span>
            <span>Indiana Backflow Testing</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Indiana Backflow Testing Directory
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Browse certified backflow testers across all Indiana cities and counties. Compliant with IDEM cross-connection control requirements.
          </p>
        </div>
      </section>

      {/* Indiana compliance summary */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="container-site py-6">
          <h2 className="font-semibold text-slate-900 mb-2">Indiana Backflow Testing Requirements</h2>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Indiana&rsquo;s cross-connection control program requires annual backflow assembly testing for commercial, industrial, and irrigation systems.
            Testing must be performed by a state-certified tester and results submitted to your water utility.
            See{' '}
            <Link href="/resources/indiana-backflow-testing-requirements/" className="text-blue-700 underline">
              Indiana requirements
            </Link>{' '}
            for full details.
          </p>
        </div>
      </section>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* City list */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Browse by City ({cityList.length > 0 ? cityList.length : '20+'} cities)
            </h2>
            {cityList.length === 0 ? (
              <div className="card p-6 text-slate-500 text-sm">
                City data is being loaded. Check back soon or use the search form.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cityList.map((city) => (
                  <Link
                    key={city.id}
                    href={`/backflow-testing/indiana/${city.slug}/`}
                    className="card-hover px-3 py-2.5 text-sm text-slate-700 hover:text-blue-700"
                  >
                    <span className="font-medium">{city.name}</span>
                    {city.county && <span className="text-xs text-slate-400 block">{city.county} Co.</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* County links */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Browse by County</h3>
              <ul className="space-y-1.5 text-sm">
                {COUNTIES.map((county) => (
                  <li key={county}>
                    <Link
                      href={`/backflow-testing/indiana/counties/${slugifyCounty(county)}/`}
                      className="text-blue-700 hover:underline"
                    >
                      {county} County
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Service Types</h3>
              <ul className="space-y-1.5 text-sm">
                <li><Link href="/services/irrigation-backflow-testing/" className="text-blue-700 hover:underline">Irrigation Backflow Testing</Link></li>
                <li><Link href="/services/commercial-backflow-testing/" className="text-blue-700 hover:underline">Commercial Backflow Testing</Link></li>
                <li><Link href="/services/residential-backflow-testing/" className="text-blue-700 hover:underline">Residential Backflow Testing</Link></li>
                <li><Link href="/services/fire-line-backflow-testing/" className="text-blue-700 hover:underline">Fire Line Backflow Testing</Link></li>
                <li><Link href="/services/annual-backflow-inspection/" className="text-blue-700 hover:underline">Annual Backflow Inspection</Link></li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-blue-700 text-white rounded-xl p-5">
              <h3 className="font-semibold mb-2">Need Testing Now?</h3>
              <p className="text-sm text-blue-100 mb-4">Get connected with a certified Indiana tester fast.</p>
              <Link href="/request-backflow-test/" className="block text-center bg-white text-blue-700 font-semibold py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                Request a Quote
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
