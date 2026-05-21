import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import LeadForm from '@/components/forms/LeadForm'
import JsonLd from '@/components/seo/JsonLd'
import type { Provider } from '@/types'

type Props = { params: Promise<{ 'provider-slug': string }> }

async function getProvider(slug: string): Promise<Provider | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('providers')
    .select('*')
    .eq('provider_slug', slug)
    .eq('is_active', true)
    .single()
  return data as Provider | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'provider-slug': slug } = await params
  const provider = await getProvider(slug)

  if (!provider) return { title: 'Provider Not Found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  return {
    title: `${provider.business_name} — Indiana Backflow Testing`,
    description: `${provider.business_name} provides certified backflow testing in ${provider.city || 'Indiana'}. ${provider.is_verified ? 'Verified provider.' : ''} View contact info, service areas, and request a quote.`,
    alternates: {
      canonical: `${siteUrl}/providers/${slug}/`,
    },
  }
}

export default async function ProviderProfilePage({ params }: Props) {
  const { 'provider-slug': slug } = await params
  const provider = await getProvider(slug)

  if (!provider) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const providerSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: provider.business_name,
    url: provider.website || `${siteUrl}/providers/${provider.provider_slug}/`,
    telephone: provider.phone || undefined,
    email: provider.email || undefined,
    address: provider.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: provider.address,
          addressLocality: provider.city || 'Indiana',
          addressRegion: 'IN',
          postalCode: provider.zip || undefined,
          addressCountry: 'US',
        }
      : undefined,
    areaServed: provider.service_areas.map((area) => ({
      '@type': 'City',
      name: area,
      containedInPlace: { '@type': 'State', name: 'Indiana' },
    })),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Providers', item: `${siteUrl}/backflow-testing/indiana/` },
      { '@type': 'ListItem', position: 3, name: provider.business_name, item: `${siteUrl}/providers/${slug}/` },
    ],
  }

  const isDemoProvider = provider.source_name?.toLowerCase().includes('demo')

  return (
    <>
      <JsonLd data={[providerSchema, breadcrumb]} />

      <section className="bg-[#0f2044] text-white py-10">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Indiana Directory', href: '/backflow-testing/indiana/' },
              { label: provider.business_name },
            ]}
          />
          <div className="flex flex-wrap items-start gap-3 mt-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{provider.business_name}</h1>
              <p className="text-blue-200 text-sm">
                {[provider.city, provider.county ? `${provider.county} County` : null, 'Indiana']
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              {provider.is_verified && (
                <span className="badge-verified text-sm px-3 py-1">
                  ✓ Verified Certified Provider
                </span>
              )}
              {isDemoProvider && (
                <span className="badge-demo text-sm px-3 py-1">Demo Listing</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-site py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {isDemoProvider && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                <strong>Note:</strong> This is a demo/placeholder listing. Credentials have not been verified. Do not hire based on this listing alone.
              </div>
            )}

            {/* Contact info */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 text-lg mb-4">Contact Information</h2>
              <dl className="space-y-3">
                {provider.phone && (
                  <div className="flex gap-3">
                    <dt className="text-slate-500 text-sm w-24 shrink-0">Phone</dt>
                    <dd>
                      <a href={`tel:${provider.phone.replace(/\D/g, '')}`} className="font-medium text-blue-700 hover:underline text-lg">
                        {provider.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {provider.email && (
                  <div className="flex gap-3">
                    <dt className="text-slate-500 text-sm w-24 shrink-0">Email</dt>
                    <dd>
                      <a href={`mailto:${provider.email}`} className="text-blue-700 hover:underline">
                        {provider.email}
                      </a>
                    </dd>
                  </div>
                )}
                {provider.website && (
                  <div className="flex gap-3">
                    <dt className="text-slate-500 text-sm w-24 shrink-0">Website</dt>
                    <dd>
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                        {provider.website.replace(/^https?:\/\//, '')}
                      </a>
                    </dd>
                  </div>
                )}
                {provider.address && (
                  <div className="flex gap-3">
                    <dt className="text-slate-500 text-sm w-24 shrink-0">Address</dt>
                    <dd className="text-slate-900">{provider.address}{provider.city ? `, ${provider.city}` : ''}{provider.zip ? ` ${provider.zip}` : ''}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Credentials */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 text-lg mb-4">Credentials</h2>
              <dl className="space-y-3">
                {provider.license_number && (
                  <div className="flex gap-3">
                    <dt className="text-slate-500 text-sm w-32 shrink-0">License #</dt>
                    <dd className="font-mono text-slate-900">{provider.license_number}</dd>
                  </div>
                )}
                {provider.certification_type && (
                  <div className="flex gap-3">
                    <dt className="text-slate-500 text-sm w-32 shrink-0">Certification</dt>
                    <dd className="text-slate-900">{provider.certification_type}</dd>
                  </div>
                )}
                {provider.contact_name && (
                  <div className="flex gap-3">
                    <dt className="text-slate-500 text-sm w-32 shrink-0">Contact</dt>
                    <dd className="text-slate-900">{provider.contact_name}</dd>
                  </div>
                )}
              </dl>
              {!provider.is_verified && (
                <p className="text-xs text-slate-400 mt-4">
                  Credentials not yet independently verified. Always confirm certification with the provider directly.
                </p>
              )}
            </div>

            {/* Service types */}
            {provider.service_types.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-900 text-lg mb-3">Service Types</h2>
                <div className="flex flex-wrap gap-2">
                  {provider.service_types.map((s) => (
                    <span key={s} className="bg-blue-50 text-blue-800 text-sm px-3 py-1.5 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service areas */}
            {provider.service_areas.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-slate-900 text-lg mb-3">Service Areas</h2>
                <div className="flex flex-wrap gap-2">
                  {provider.service_areas.map((area) => (
                    <Link
                      key={area}
                      href={`/backflow-testing/indiana/${area.toLowerCase().replace(/\s+/g, '-')}/`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-3 py-1 rounded-full transition-colors"
                    >
                      {area}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Source */}
            {provider.source_name && !isDemoProvider && (
              <p className="text-xs text-slate-400">
                Data source: {provider.source_name}
                {provider.source_url && (
                  <> — <a href={provider.source_url} className="hover:underline" target="_blank" rel="noopener noreferrer">View source</a></>
                )}
              </p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {provider.phone && (
              <a
                href={`tel:${provider.phone.replace(/\D/g, '')}`}
                className="btn-teal w-full text-base py-4 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call {provider.phone}
              </a>
            )}

            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Request a Quote</h3>
              <LeadForm
                cityName={provider.city || undefined}
                compact
              />
            </div>

            <div className="card p-5">
              <p className="text-sm text-slate-600 mb-3">Is this your business?</p>
              <Link href="/claim-listing/" className="btn-secondary text-sm w-full">
                Claim This Listing
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
