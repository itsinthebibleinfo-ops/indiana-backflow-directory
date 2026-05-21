import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProviderCard from '@/components/providers/ProviderCard'
import LeadForm from '@/components/forms/LeadForm'
import FAQSection from '@/components/seo/FAQSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import AlertBanner from '@/components/ui/AlertBanner'
import {
  generateCityContent,
  buildCityJsonLd,
  SERVICE_PAGES,
} from '@/lib/seo/cityContent'
import type { City, Provider } from '@/types'

type Props = {
  params: Promise<{ 'city-slug': string }>
}

async function getCityAndProviders(slug: string) {
  const supabase = await createClient()

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!city) return null

  // Providers linked via junction table OR city text field
  const { data: linkedProviders } = await supabase
    .from('provider_cities')
    .select('provider_id')
    .eq('city_id', city.id)

  const linkedIds = (linkedProviders || []).map((r: { provider_id: string }) => r.provider_id)

  let providerQuery = supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)

  if (linkedIds.length > 0) {
    providerQuery = providerQuery.or(
      `id.in.(${linkedIds.join(',')}),city.ilike.%${city.name}%,service_areas.cs.{${city.name}}`
    )
  } else {
    providerQuery = providerQuery.or(
      `city.ilike.%${city.name}%,service_areas.cs.{${city.name}}`
    )
  }

  const { data: providers } = await providerQuery
    .order('is_featured', { ascending: false })
    .order('is_verified', { ascending: false })
    .limit(20)

  // Nearby cities (same county)
  const { data: nearbyCities } = city.county
    ? await supabase
        .from('cities')
        .select('id, name, slug')
        .eq('county', city.county)
        .neq('id', city.id)
        .limit(6)
    : { data: [] }

  return {
    city: city as City,
    providers: (providers || []) as Provider[],
    nearbyCities: (nearbyCities || []) as Pick<City, 'id' | 'name' | 'slug'>[],
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'city-slug': slug } = await params
  const data = await getCityAndProviders(slug)

  if (!data) {
    return { title: 'City Not Found' }
  }

  const content = generateCityContent({ city: data.city, providers: data.providers })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${siteUrl}/backflow-testing/indiana/${slug}/`,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { 'city-slug': slug } = await params
  const data = await getCityAndProviders(slug)

  if (!data) notFound()

  const { city, providers, nearbyCities } = data
  const content = generateCityContent({ city, providers })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const jsonLdSchemas = buildCityJsonLd(city, providers, siteUrl)

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Indiana Backflow Testing', href: '/backflow-testing/indiana/' },
    { label: `${city.name}, IN` },
  ]

  return (
    <>
      <JsonLd data={jsonLdSchemas} />

      {/* Hero */}
      <section className="bg-[#0f2044] text-white py-10">
        <div className="container-site">
          <div className="mb-3">
            <Breadcrumbs
              items={breadcrumbItems.map((b) => ({
                label: b.label,
                href: 'href' in b ? b.href : undefined,
              }))}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{content.h1}</h1>
          <p className="text-blue-100 max-w-2xl leading-relaxed">{content.intro}</p>
        </div>
      </section>

      {/* Compliance notice */}
      <div className="container-site mt-6">
        <AlertBanner type="info">
          <strong>Disclaimer:</strong> Listings are informational only. Always verify tester credentials directly
          and confirm they appear on your utility&rsquo;s approved list before hiring.
        </AlertBanner>
      </div>

      <div className="container-site py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Utility card */}
            {city.water_utility && (
              <div className="card p-5 border-l-4 border-blue-500">
                <h2 className="font-semibold text-slate-900 mb-1">Water Utility</h2>
                <p className="text-slate-700 font-medium text-lg">{city.water_utility}</p>
                {city.enforcement_portal && (
                  <p className="text-sm text-slate-500 mt-1">
                    Submit reports via:{' '}
                    <a href={city.enforcement_portal} className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">
                      {city.enforcement_portal}
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* Compliance section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                Backflow Compliance in {city.name}
              </h2>
              <p className="text-slate-600 leading-relaxed">{content.complianceSection}</p>
            </div>

            {/* H2 sections */}
            {content.h2Sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{section.heading}</h2>
                <p className="text-slate-600 leading-relaxed">{section.body}</p>
              </div>
            ))}

            {/* Providers */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Certified Backflow Testers in {city.name}
                {providers.length > 0 && (
                  <span className="ml-2 text-base font-normal text-slate-500">
                    ({providers.length} listed)
                  </span>
                )}
              </h2>
              {providers.length === 0 ? (
                <div className="card p-6 text-slate-500">
                  <p className="mb-4">
                    No providers are currently listed for {city.name}. Be the first to claim or add a listing.
                  </p>
                  <Link href="/claim-listing/" className="btn-primary text-sm px-4 py-2">
                    Claim Your Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {providers.map((p) => (
                    <ProviderCard key={p.id} provider={p} showServiceAreas />
                  ))}
                </div>
              )}
            </div>

            {/* FAQ */}
            <FAQSection
              items={content.faqItems}
              heading={`Backflow Testing FAQ — ${city.name}, Indiana`}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quote form */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4 text-lg">
                Request a Quote in {city.name}
              </h3>
              <LeadForm
                citySlug={city.slug}
                cityName={city.name}
                cityId={city.id}
                compact
              />
            </div>

            {/* Service links */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Service Types</h3>
              <ul className="space-y-1.5 text-sm">
                {SERVICE_PAGES.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}/`} className="text-blue-700 hover:underline">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* County link */}
            {city.county && (
              <div className="card p-5">
                <h3 className="font-semibold text-slate-900 mb-3">County</h3>
                <Link
                  href={`/backflow-testing/indiana/counties/${city.county.toLowerCase().replace(/\s+/g, '-')}/`}
                  className="text-blue-700 hover:underline text-sm"
                >
                  Browse {city.county} County Providers →
                </Link>
              </div>
            )}

            {/* Nearby cities */}
            {nearbyCities.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Nearby Cities</h3>
                <ul className="space-y-1.5 text-sm">
                  {nearbyCities.map((c) => (
                    <li key={c.id}>
                      <Link href={`/backflow-testing/indiana/${c.slug}/`} className="text-blue-700 hover:underline">
                        Backflow Testing in {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Claim CTA */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-sm text-slate-600 mb-3">
                Are you a certified backflow tester serving {city.name}?
              </p>
              <Link href="/claim-listing/" className="btn-secondary text-sm w-full">
                Claim or Add Your Listing
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
