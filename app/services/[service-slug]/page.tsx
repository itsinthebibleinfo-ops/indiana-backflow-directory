import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProviderCard from '@/components/providers/ProviderCard'
import LeadForm from '@/components/forms/LeadForm'
import FAQSection from '@/components/seo/FAQSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import type { Provider } from '@/types'

type Props = { params: Promise<{ 'service-slug': string }> }

const SERVICE_DATA: Record<string, {
  title: string
  description: string
  intro: string
  faqs: Array<{ question: string; answer: string }>
}> = {
  'irrigation-backflow-testing': {
    title: 'Irrigation Backflow Testing Indiana',
    description: 'Find certified irrigation backflow testers in Indiana. Annual RPZ and PVB testing for residential and commercial irrigation systems.',
    intro: `Irrigation systems are one of the most common sources of backflow hazards in Indiana. If your property has an in-ground irrigation system connected to the public water supply, your water utility likely requires annual backflow prevention assembly testing. Find certified Indiana testers for your irrigation system here.`,
    faqs: [
      { question: 'Is backflow testing required for irrigation systems in Indiana?', answer: 'Yes. Most Indiana water utilities require annual backflow prevention assembly testing for irrigation systems with a direct connection to the public water supply. Failure to test can result in a non-compliance notice or water service interruption.' },
      { question: 'What type of backflow preventer is on an irrigation system?', answer: 'Most Indiana irrigation systems use a Reduced Pressure Zone (RPZ) assembly, Pressure Vacuum Breaker (PVB), or Double Check Valve Assembly (DCVA). Your tester will identify your device type and perform the appropriate test.' },
      { question: 'How much does irrigation backflow testing cost in Indiana?', answer: 'Typical cost in Indiana is $75–$150 per assembly. Pricing varies by device type and location.' },
    ],
  },
  'commercial-backflow-testing': {
    title: 'Commercial Backflow Testing Indiana',
    description: 'Commercial backflow prevention testing by certified Indiana providers. Annual testing for restaurants, offices, apartments, and industrial facilities.',
    intro: `Commercial properties in Indiana — restaurants, apartment complexes, office buildings, warehouses, and industrial sites — are required to have backflow prevention assemblies tested annually by a certified tester. Failure to comply can result in notices from your water utility and potential service interruption.`,
    faqs: [
      { question: 'Does my commercial building in Indiana need backflow testing?', answer: 'Almost certainly yes. Indiana water utilities require annual backflow testing for virtually all commercial connections. Contact your utility to confirm the specific requirements for your property.' },
      { question: 'What kinds of commercial properties need backflow testing?', answer: 'Restaurants, hotels, apartment buildings, office buildings, healthcare facilities, warehouses, industrial plants, churches, schools, and any commercial property with a cross-connection hazard.' },
    ],
  },
  'residential-backflow-testing': {
    title: 'Residential Backflow Testing Indiana',
    description: 'Certified residential backflow testing in Indiana for homes and duplexes with irrigation or high-hazard connections.',
    intro: `Many Indiana homeowners are surprised to learn their property needs backflow testing. If your home has an in-ground irrigation system or a secondary water connection, your water utility may require annual testing of your backflow prevention assembly.`,
    faqs: [
      { question: 'Does my house need backflow testing in Indiana?', answer: 'If you have an in-ground irrigation system, a private well connection, or a similar cross-connection, your water utility may require annual backflow testing. Check with your utility to confirm your obligations.' },
      { question: 'How do I know if I have a backflow preventer?', answer: 'If you have an irrigation system, there is likely a backflow preventer at or near the point where the irrigation system connects to the water supply. A certified tester can inspect your property and identify the device.' },
    ],
  },
  'fire-line-backflow-testing': {
    title: 'Fire Line Backflow Testing Indiana',
    description: 'Certified fire suppression system backflow testing in Indiana. Annual fire line RPZ and double check valve testing and reporting.',
    intro: `Fire suppression systems present a potential cross-connection risk because they may contain standing water mixed with chemical agents. Indiana water utilities require annual backflow testing for fire line connections, typically using a Reduced Pressure Zone (RPZ) or Double Check Valve Assembly (DCVA).`,
    faqs: [
      { question: 'Is fire line backflow testing required in Indiana?', answer: 'Yes. Most Indiana water utilities require annual backflow testing for fire suppression system connections. This includes buildings with fire sprinklers and suppression systems connected to the public water supply.' },
      { question: 'What type of device is used on a fire line?', answer: 'Most fire line connections use an RPZ (Reduced Pressure Zone) assembly or a DCVA (Double Check Valve Assembly). Both require annual testing by a certified tester.' },
    ],
  },
  'annual-backflow-inspection': {
    title: 'Annual Backflow Inspection Indiana',
    description: 'Annual backflow prevention assembly inspections in Indiana. Testing, reporting, and submission to your water utility by certified testers.',
    intro: `Indiana water utilities require backflow prevention assembly testing at least once per year. This annual inspection includes testing the assembly under pressure, inspecting components for wear, and submitting the test report to your utility. Find a certified Indiana tester to keep your property compliant.`,
    faqs: [
      { question: 'What happens during an annual backflow inspection?', answer: 'A certified tester will test your backflow prevention assembly using calibrated test gauges, inspect components for wear or damage, complete the required test report form, and submit results to your water utility. Testing typically takes 15–45 minutes per assembly.' },
      { question: 'What if my backflow preventer fails the annual test?', answer: 'If your assembly fails, the tester will document the failure on the test report. You will need to have the device repaired or replaced by a licensed plumber, then have it re-tested by a certified tester before submitting a passing report to your utility.' },
    ],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'service-slug': slug } = await params
  const service = SERVICE_DATA[slug]
  if (!service) return { title: 'Service Not Found' }
  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/services/${slug}/`,
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { 'service-slug': slug } = await params
  const service = SERVICE_DATA[slug]
  if (!service) notFound()

  const supabase = await createClient()
  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)
    .contains('service_types', [slug.replace(/-/g, ' ')])
    .order('is_featured', { ascending: false })
    .order('is_verified', { ascending: false })
    .limit(10)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Indiana Backflow Testing Directory',
      url: siteUrl,
    },
    areaServed: { '@type': 'State', name: 'Indiana' },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <JsonLd data={[serviceSchema, faqSchema]} />

      <section className="bg-[#0f2044] text-white py-10">
        <div className="container-site">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Services' },
            { label: service.title },
          ]} />
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-3">{service.title}</h1>
          <p className="text-blue-100 max-w-2xl">{service.description}</p>
        </div>
      </section>

      <div className="container-site py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">About This Service</h2>
              <p className="text-slate-600 leading-relaxed">{service.intro}</p>
            </div>

            {providers && providers.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Indiana Providers Offering This Service
                </h2>
                <div className="space-y-4">
                  {(providers as Provider[]).map((p) => (
                    <ProviderCard key={p.id} provider={p} showServiceAreas />
                  ))}
                </div>
              </div>
            )}

            <FAQSection items={service.faqs} />
          </div>

          <aside className="space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Request a Quote</h3>
              <LeadForm compact />
            </div>
            <div className="card p-5 text-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Other Service Types</h3>
              <ul className="space-y-1.5">
                {Object.entries(SERVICE_DATA).filter(([s]) => s !== slug).map(([s, d]) => (
                  <li key={s}>
                    <Link href={`/services/${s}/`} className="text-blue-700 hover:underline">{d.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
