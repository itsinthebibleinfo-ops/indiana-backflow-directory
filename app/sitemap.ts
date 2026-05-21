import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indianabackflowtesting.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Skip DB calls if Supabase is not configured (e.g. CI/CD build without secrets)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  let cities: Array<{ slug: string; updated_at: string }> = []
  let providers: Array<{ provider_slug: string; updated_at: string }> = []

  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const [cityResult, providerResult] = await Promise.all([
      supabase.from('cities').select('slug, updated_at'),
      supabase.from('providers').select('provider_slug, updated_at').eq('is_active', true),
    ])
    cities = cityResult.data || []
    providers = providerResult.data || []
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/backflow-testing/indiana/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/request-backflow-test/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/claim-listing/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    // Service pages
    { url: `${siteUrl}/services/irrigation-backflow-testing/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services/commercial-backflow-testing/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services/residential-backflow-testing/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services/fire-line-backflow-testing/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/services/annual-backflow-inspection/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Resource pages
    { url: `${siteUrl}/resources/what-is-backflow-testing/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/resources/indiana-backflow-testing-requirements/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/resources/how-often-is-backflow-testing-required/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/resources/backflow-testing-cost-indiana/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/resources/backflow-prevention-device-types/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/resources/failed-backflow-test-what-to-do/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const cityPages: MetadataRoute.Sitemap = (cities || []).map((city: { slug: string; updated_at: string }) => ({
    url: `${siteUrl}/backflow-testing/indiana/${city.slug}/`,
    lastModified: city.updated_at ? new Date(city.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const providerPages: MetadataRoute.Sitemap = (providers || []).map((p: { provider_slug: string; updated_at: string }) => ({
    url: `${siteUrl}/providers/${p.provider_slug}/`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...cityPages, ...providerPages]
}
