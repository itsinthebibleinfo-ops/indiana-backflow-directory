import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProviderCard from '@/components/providers/ProviderCard'
import LeadForm from '@/components/forms/LeadForm'
import FAQSection from '@/components/seo/FAQSection'
import JsonLd from '@/components/seo/JsonLd'
import type { City, Provider } from '@/types'

export const metadata: Metadata = {
  title: "Indiana's Searchable Backflow Testing Directory | Certified Testers",
  description:
    'Avoid missed compliance deadlines. Find certified Indiana backflow prevention testers for irrigation, domestic, commercial, and fire protection systems.',
  openGraph: {
    title: "Indiana's Searchable Backflow Testing Directory",
    description:
      'Find certified backflow prevention testers across Indiana. Search by city, service type, or utility provider.',
  },
}

const SERVICE_CARDS = [
  {
    slug: 'irrigation-backflow-testing',
    icon: '💧',
    title: 'Irrigation Backflow Testing',
    desc: 'Annual testing for residential and commercial irrigation backflow prevention assemblies.',
  },
  {
    slug: 'commercial-backflow-testing',
    icon: '🏢',
    title: 'Commercial Backflow Testing',
    desc: 'Certified testing for commercial, industrial, and mixed-use properties.',
  },
  {
    slug: 'residential-backflow-testing',
    icon: '🏠',
    title: 'Residential Backflow Testing',
    desc: 'Home and duplex backflow assembly testing and reporting.',
  },
  {
    slug: 'fire-line-backflow-testing',
    icon: '🔥',
    title: 'Fire Line Backflow Testing',
    desc: 'Fire suppression system backflow preventer inspections and annual reports.',
  },
  {
    slug: 'annual-backflow-inspection',
    icon: '📋',
    title: 'Annual Backflow Inspection',
    desc: 'Full annual inspection, testing, and report submission to your water utility.',
  },
]

const TOP_CITIES = [
  'Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend',
  'Carmel', 'Fishers', 'Bloomington', 'Lafayette',
  'Muncie', 'Terre Haute', 'Gary', 'Noblesville',
  'Greenwood', 'Anderson', 'Elkhart', 'Kokomo',
  'Mishawaka', 'Columbus', 'Jeffersonville', 'Lawrence',
]

const FAQ_ITEMS = [
  {
    question: 'What is backflow testing and why is it required in Indiana?',
    answer:
      'Backflow occurs when water flows backward through your plumbing into the public water supply, potentially carrying contaminants. Indiana requires annual backflow prevention testing for most commercial properties, irrigation systems, and other cross-connection hazards to protect public drinking water quality under IDEM and utility cross-connection control programs.',
  },
  {
    question: 'How do I find a certified backflow tester near me in Indiana?',
    answer:
      'Use this directory to search by city or county. All providers listed are certified to perform backflow testing in Indiana. Look for the "Verified" badge for providers whose credentials have been confirmed by our team.',
  },
  {
    question: 'How often is backflow testing required in Indiana?',
    answer:
      'Most water utilities in Indiana require annual backflow prevention assembly testing. Test reports must be submitted to your water utility, typically within 30 to 60 days of the due date. Always check with your specific utility for their testing schedule.',
  },
  {
    question: 'What does backflow testing cost in Indiana?',
    answer:
      'Backflow testing in Indiana typically costs $75–$200 per assembly. Prices vary based on device type, location, and provider. Large commercial systems with multiple assemblies may cost more. Use this directory to request quotes from multiple certified testers.',
  },
  {
    question: 'I received a past-due backflow testing notice. What do I do?',
    answer:
      'Act quickly. Contact a certified backflow tester as soon as possible — most can accommodate urgent scheduling. Failure to comply may result in water service interruption. This directory includes testers who serve all major Indiana cities.',
  },
]

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProviders } = await supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('is_verified', { ascending: false })
    .limit(6)

  const { data: cities } = await supabase
    .from('cities')
    .select('id, name, slug')
    .order('name')
    .limit(30)

  const providers: Provider[] = featuredProviders || []
  const cityList: Pick<City, 'id' | 'name' | 'slug'>[] = cities || []

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Indiana Backflow Testing Directory',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://indianabackflowtesting.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://indianabackflowtesting.com'}/backflow-testing/indiana/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <JsonLd data={[websiteSchema, faqSchema]} />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero-gradient text-white">
        <div className="container-site py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">
              Indiana Backflow Testing Directory
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Indiana&rsquo;s Searchable Backflow Testing Directory
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Avoid missed compliance deadlines. Find certified Indiana backflow prevention testers for
              irrigation, domestic, commercial, and fire protection systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/backflow-testing/indiana/" className="btn-primary text-base px-6 py-3">
                Find a Certified Tester
              </Link>
              <Link href="/claim-listing/" className="btn-secondary text-base px-6 py-3">
                Claim Your Listing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Urgent callouts ───────────────────────────── */}
      <section className="bg-amber-50 border-y border-amber-200">
        <div className="container-site py-4 flex flex-col sm:flex-row gap-3 sm:gap-6">
          <Link href="/request-backflow-test/?urgency=past-due" className="flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-700">
            <span className="text-amber-500">⚠</span> Received a past-due notice?
          </Link>
          <Link href="/services/commercial-backflow-testing/" className="flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-700">
            <span className="text-amber-500">🏢</span> Commercial property owner?
          </Link>
          <Link href="/services/annual-backflow-inspection/" className="flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-700">
            <span className="text-amber-500">📅</span> Annual testing due soon?
          </Link>
        </div>
      </section>

      {/* ── City search ───────────────────────────────── */}
      <section className="section-gap">
        <div className="container-site">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 text-center">
            Find Backflow Testers by Indiana City
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Select your city to see certified providers, utility requirements, and compliance guidance.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {(cityList.length > 0 ? cityList : TOP_CITIES.map((n) => ({ id: n, name: n, slug: slugify(n) }))).map((city) => (
              <Link
                key={city.id}
                href={`/backflow-testing/indiana/${city.slug}/`}
                className="card-hover px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-700 text-center transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/backflow-testing/indiana/" className="btn-secondary text-sm">
              View All Indiana Cities →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────── */}
      <section className="section-gap bg-slate-50">
        <div className="container-site">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 text-center">
            Backflow Testing Services
          </h2>
          <p className="text-slate-500 text-center mb-8">
            Find the right certified tester for your system type.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_CARDS.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="card-hover p-5 flex gap-4 items-start group"
              >
                <span className="text-3xl shrink-0">{s.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured providers ────────────────────────── */}
      {providers.length > 0 && (
        <section className="section-gap">
          <div className="container-site">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Featured Indiana Backflow Testers
            </h2>
            <p className="text-slate-500 mb-8">Verified, active certified providers across Indiana.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((p) => (
                <ProviderCard key={p.id} provider={p} showServiceAreas />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/backflow-testing/indiana/" className="btn-secondary">
                Browse All Indiana Providers →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── What is backflow ──────────────────────────── */}
      <section className="section-gap bg-slate-50">
        <div className="container-site max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            What Is Backflow Testing?
          </h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              Backflow is the unintended reversal of water flow in a plumbing system — causing potentially
              contaminated water to flow back into the public drinking water supply. A backflow prevention
              assembly (BPA) is a mechanical device installed on your water line to stop this from happening.
            </p>
            <p>
              Indiana&rsquo;s cross-connection control program, administered by IDEM and enforced by local water
              utilities, requires property owners to have their backflow prevention assemblies tested annually by
              a state-certified tester. This applies to most commercial properties, irrigation systems, fire
              suppression systems, and any connection with a potential hazard.
            </p>
            <p>
              Failing to test on schedule can result in a non-compliance notice from your water utility and
              potential service interruption. Use this directory to find a certified tester in your Indiana city.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/resources/what-is-backflow-testing/" className="text-blue-700 font-semibold hover:underline">
              Learn more about backflow testing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Indiana compliance ────────────────────────── */}
      <section className="section-gap">
        <div className="container-site max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Indiana Backflow Testing Requirements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card p-5 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-1">Annual</div>
              <div className="text-sm text-slate-600">Testing frequency required by most Indiana utilities</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-1">Certified</div>
              <div className="text-sm text-slate-600">Tester must hold ASSE 5110/5120 or utility-approved credentials</div>
            </div>
            <div className="card p-5 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-1">Reported</div>
              <div className="text-sm text-slate-600">Results submitted directly to your water utility</div>
            </div>
          </div>
          <Link href="/resources/indiana-backflow-testing-requirements/" className="text-blue-700 font-semibold hover:underline text-sm">
            View full Indiana backflow testing requirements →
          </Link>
        </div>
      </section>

      {/* ── Lead form ─────────────────────────────────── */}
      <section className="section-gap bg-[#0f2044] text-white">
        <div className="container-site max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
            Request a Backflow Testing Quote
          </h2>
          <p className="text-blue-200 text-center mb-8">
            Tell us about your property and we&rsquo;ll connect you with certified Indiana testers.
          </p>
          <div className="bg-white rounded-2xl p-6 sm:p-8">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="section-gap">
        <div className="container-site max-w-3xl">
          <FAQSection items={FAQ_ITEMS} heading="Backflow Testing FAQ — Indiana" />
        </div>
      </section>

      {/* ── Internal links ────────────────────────────── */}
      <section className="section-gap bg-slate-50">
        <div className="container-site">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Explore the Directory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">By City</h3>
              <ul className="space-y-1.5 text-sm">
                {TOP_CITIES.slice(0, 6).map((city) => (
                  <li key={city}>
                    <Link href={`/backflow-testing/indiana/${slugify(city)}/`} className="text-blue-700 hover:underline">
                      Backflow Testing in {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">By Service</h3>
              <ul className="space-y-1.5 text-sm">
                {SERVICE_CARDS.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}/`} className="text-blue-700 hover:underline">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Resources</h3>
              <ul className="space-y-1.5 text-sm">
                <li><Link href="/resources/what-is-backflow-testing/" className="text-blue-700 hover:underline">What Is Backflow Testing?</Link></li>
                <li><Link href="/resources/indiana-backflow-testing-requirements/" className="text-blue-700 hover:underline">Indiana Requirements</Link></li>
                <li><Link href="/resources/how-often-is-backflow-testing-required/" className="text-blue-700 hover:underline">How Often Is Testing Required?</Link></li>
                <li><Link href="/resources/backflow-testing-cost-indiana/" className="text-blue-700 hover:underline">Cost of Backflow Testing</Link></li>
                <li><Link href="/resources/backflow-prevention-device-types/" className="text-blue-700 hover:underline">Device Types Explained</Link></li>
                <li><Link href="/resources/failed-backflow-test-what-to-do/" className="text-blue-700 hover:underline">What to Do After a Failed Test</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
