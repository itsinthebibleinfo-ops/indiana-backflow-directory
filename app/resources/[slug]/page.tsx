import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import LeadForm from '@/components/forms/LeadForm'
import JsonLd from '@/components/seo/JsonLd'
import { RESOURCE_PAGES } from '@/lib/seo/cityContent'

type Props = { params: Promise<{ slug: string }> }

const RESOURCES: Record<string, {
  title: string
  metaTitle: string
  metaDescription: string
  content: React.ReactNode
}> = {
  'what-is-backflow-testing': {
    title: 'What Is Backflow Testing?',
    metaTitle: 'What Is Backflow Testing? | Indiana Guide',
    metaDescription: 'Learn what backflow testing is, why it\'s required in Indiana, how it works, and who needs to have their backflow prevention assembly tested annually.',
    content: (
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p>Backflow testing is the annual inspection and pressure test of a backflow prevention assembly — a mechanical device that protects the public water supply from contamination caused by reversed water flow.</p>
        <h2 className="text-xl font-bold text-slate-900">What Is Backflow?</h2>
        <p>Backflow occurs when water flows backward through a plumbing connection — from your property into the public water system. This can carry contaminants like fertilizer, cleaning chemicals, human waste, or industrial fluids into the drinking water supply.</p>
        <h2 className="text-xl font-bold text-slate-900">What Is a Backflow Prevention Assembly?</h2>
        <p>A backflow prevention assembly (BPA) is a mechanical valve device installed on your water connection that prevents water from reversing direction. Common types include RPZ (Reduced Pressure Zone) assemblies, Double Check Valve Assemblies (DCVA), and Pressure Vacuum Breakers (PVB).</p>
        <h2 className="text-xl font-bold text-slate-900">Why Is Annual Testing Required?</h2>
        <p>Backflow prevention devices contain springs, seals, and diaphragms that wear over time. Annual testing confirms the device is functioning correctly. Indiana water utilities require this testing under their cross-connection control programs, which are regulated by IDEM (Indiana Department of Environmental Management).</p>
        <h2 className="text-xl font-bold text-slate-900">Who Performs Backflow Testing?</h2>
        <p>Testing must be performed by a state-certified backflow tester. In Indiana, testers typically hold ASSE 5110 or ASSE 5120 certification, or credentials approved by your specific water utility. Always verify tester credentials before hiring.</p>
      </div>
    ),
  },
  'indiana-backflow-testing-requirements': {
    title: 'Indiana Backflow Testing Requirements',
    metaTitle: 'Indiana Backflow Testing Requirements | IDEM & Utility Rules',
    metaDescription: 'Complete guide to Indiana backflow testing requirements, including IDEM regulations, water utility rules, testing frequency, and who is required to test.',
    content: (
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p>Indiana regulates backflow prevention through IDEM&rsquo;s cross-connection control program and individual water utility cross-connection control programs. Here&rsquo;s what property owners need to know.</p>
        <h2 className="text-xl font-bold text-slate-900">Who Is Required to Test?</h2>
        <p>In Indiana, backflow testing is typically required for: commercial and industrial properties, properties with irrigation systems, fire sprinkler systems, medical/dental offices, restaurants and food service facilities, car washes, multi-unit residential buildings, and any connection with a moderate or high cross-connection hazard.</p>
        <h2 className="text-xl font-bold text-slate-900">How Often?</h2>
        <p>Annual testing is required by most Indiana water utilities. Some high-hazard assemblies may require more frequent testing. Always check with your specific utility.</p>
        <h2 className="text-xl font-bold text-slate-900">Approved Testers</h2>
        <p>Testers must be certified through an ASSE-accredited program (typically ASSE 5110 or 5120). Many utilities maintain their own approved tester lists. Check with your utility before hiring a tester to ensure they are approved.</p>
        <h2 className="text-xl font-bold text-slate-900">Test Report Submission</h2>
        <p>After testing, the certified tester completes a standardized test report form and submits it to your water utility. Property owners are responsible for ensuring timely test completion and submission. Deadlines vary by utility.</p>
        <h2 className="text-xl font-bold text-slate-900">Penalties for Non-Compliance</h2>
        <p>Failure to comply may result in a notice of non-compliance, followed by service interruption if the issue is not resolved. Contact a certified tester immediately if you have received a past-due notice.</p>
      </div>
    ),
  },
  'how-often-is-backflow-testing-required': {
    title: 'How Often Is Backflow Testing Required in Indiana?',
    metaTitle: 'How Often Is Backflow Testing Required in Indiana?',
    metaDescription: 'Indiana requires annual backflow testing for most commercial and irrigation systems. Learn about testing frequencies and submission deadlines.',
    content: (
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p>In Indiana, most backflow prevention assemblies must be tested once per year. This is the standard requirement for both commercial and residential irrigation assemblies.</p>
        <h2 className="text-xl font-bold text-slate-900">Annual Testing Standard</h2>
        <p>The annual testing requirement applies to the vast majority of backflow prevention assemblies in Indiana. Your water utility sets the specific due date for your property — typically tied to the installation date or a fixed calendar date.</p>
        <h2 className="text-xl font-bold text-slate-900">High-Hazard Connections</h2>
        <p>Some high-hazard connections — such as certain industrial, chemical, or medical facilities — may be required to test more frequently, or to have additional protective measures in place.</p>
        <h2 className="text-xl font-bold text-slate-900">After a Failure</h2>
        <p>If your backflow assembly fails its annual test, the failed device must be repaired or replaced and then re-tested before a passing report can be submitted to your utility.</p>
        <h2 className="text-xl font-bold text-slate-900">New Installations</h2>
        <p>A newly installed backflow prevention assembly must be tested before being placed into service, and then annually thereafter.</p>
      </div>
    ),
  },
  'backflow-testing-cost-indiana': {
    title: 'Backflow Testing Cost in Indiana',
    metaTitle: 'Backflow Testing Cost in Indiana | 2025 Price Guide',
    metaDescription: 'How much does backflow testing cost in Indiana? Typical prices range from $75 to $200 per assembly. Learn what affects cost and how to get quotes.',
    content: (
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p>Backflow testing in Indiana typically costs between $75 and $200 per assembly, depending on device type, location, and the certified tester you choose.</p>
        <h2 className="text-xl font-bold text-slate-900">Typical Price Ranges</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Residential irrigation PVB/RPZ: $75–$125</li>
          <li>Commercial single assembly: $100–$175</li>
          <li>Large commercial or fire line RPZ: $150–$250+</li>
          <li>Multiple assemblies at same property: often discounted per assembly</li>
        </ul>
        <h2 className="text-xl font-bold text-slate-900">What Affects the Cost?</h2>
        <p>Device type (RPZ assemblies are more involved to test than PVBs), accessibility (assemblies in tight mechanical rooms cost more), location (urban vs. rural), and the provider&rsquo;s pricing structure all affect final cost.</p>
        <h2 className="text-xl font-bold text-slate-900">Does the Test Fee Include Report Submission?</h2>
        <p>Most certified testers include report submission to your utility in their fee. Always confirm this before hiring — some testers charge extra for administrative services.</p>
        <h2 className="text-xl font-bold text-slate-900">Get Multiple Quotes</h2>
        <p>Use this directory to request quotes from multiple certified testers in your area. Prices can vary significantly between providers.</p>
      </div>
    ),
  },
  'backflow-prevention-device-types': {
    title: 'Backflow Prevention Device Types Explained',
    metaTitle: 'Backflow Prevention Device Types | RPZ, DCVA, PVB Explained',
    metaDescription: 'Learn the difference between RPZ, DCVA, PVB, and AVB backflow prevention devices used in Indiana. Understand which device you have and what testing involves.',
    content: (
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p>There are several types of backflow prevention assemblies used in Indiana. The type you have determines which tests are performed and what certification your tester needs.</p>
        <h2 className="text-xl font-bold text-slate-900">Reduced Pressure Zone (RPZ) Assembly</h2>
        <p>The most common high-hazard device in commercial and industrial applications. Uses two check valves and a relief valve to prevent backflow. Required testing is more involved than simpler devices. Common on fire lines, irrigation with chemical injection, and high-hazard commercial connections.</p>
        <h2 className="text-xl font-bold text-slate-900">Double Check Valve Assembly (DCVA)</h2>
        <p>Two independently acting check valves. Used for low-to-moderate hazard connections including irrigation systems, apartment buildings, and commercial water services without high-hazard chemicals.</p>
        <h2 className="text-xl font-bold text-slate-900">Pressure Vacuum Breaker (PVB)</h2>
        <p>A spring-loaded check valve with an air inlet that opens when pressure drops. Commonly used on residential and commercial irrigation systems. Must be installed above the highest outlet on the system.</p>
        <h2 className="text-xl font-bold text-slate-900">Atmospheric Vacuum Breaker (AVB)</h2>
        <p>The simplest device, used for individual hose bibs and low-hazard applications. Not testable under pressure — does not require an annual test in most jurisdictions, but must be inspected for proper operation.</p>
      </div>
    ),
  },
  'failed-backflow-test-what-to-do': {
    title: 'What to Do After a Failed Backflow Test',
    metaTitle: 'Failed Backflow Test in Indiana — What to Do Next',
    metaDescription: 'Your backflow test failed — now what? Learn the exact steps to take after a failed backflow test in Indiana, including repair, re-testing, and report submission.',
    content: (
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
        <p>Receiving a failed backflow test result can be stressful, but the process is straightforward if you act promptly. Here&rsquo;s what to do.</p>
        <h2 className="text-xl font-bold text-slate-900">Step 1: Understand What Failed</h2>
        <p>Your certified tester&rsquo;s report will specify which component failed (check valve #1, check valve #2, relief valve, etc.) and the measured values. Ask your tester to explain the failure if it&rsquo;s not clear.</p>
        <h2 className="text-xl font-bold text-slate-900">Step 2: Hire a Licensed Plumber to Repair or Replace the Device</h2>
        <p>A backflow prevention assembly repair or replacement must be performed by a licensed plumber (not just a tester). The plumber will either rebuild the assembly with new components or replace the entire device.</p>
        <h2 className="text-xl font-bold text-slate-900">Step 3: Have the Device Re-Tested</h2>
        <p>After repair or replacement, a certified tester must re-test the assembly and produce a passing test report. Some certified testers are also licensed plumbers and can perform both services.</p>
        <h2 className="text-xl font-bold text-slate-900">Step 4: Submit the Passing Report</h2>
        <p>The passing re-test report must be submitted to your water utility within their required timeframe. Confirm submission with your tester.</p>
        <h2 className="text-xl font-bold text-slate-900">Step 5: Keep Records</h2>
        <p>Keep copies of all test reports — both the failed test and the passing re-test. Most utilities require records to be maintained for a minimum of 3 years.</p>
      </div>
    ),
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resource = RESOURCES[slug]
  if (!resource) return { title: 'Resource Not Found' }
  return {
    title: resource.metaTitle,
    description: resource.metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/resources/${slug}/`,
    },
  }
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params
  const resource = RESOURCES[slug]
  if (!resource) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.title,
    description: resource.metaDescription,
    url: `${siteUrl}/resources/${slug}/`,
    publisher: {
      '@type': 'Organization',
      name: 'Indiana Backflow Testing Directory',
      url: siteUrl,
    },
  }

  return (
    <>
      <JsonLd data={articleSchema} />

      <section className="bg-[#0f2044] text-white py-10">
        <div className="container-site">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Resources' },
            { label: resource.title },
          ]} />
          <h1 className="text-3xl sm:text-4xl font-bold mt-3">{resource.title}</h1>
        </div>
      </section>

      <div className="container-site py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {resource.content}
          </article>

          <aside className="space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Find a Certified Tester</h3>
              <LeadForm compact />
            </div>

            <div className="card p-5 text-sm">
              <h3 className="font-semibold text-slate-900 mb-3">More Resources</h3>
              <ul className="space-y-1.5">
                {RESOURCE_PAGES.filter((r) => r.slug !== slug).map((r) => (
                  <li key={r.slug}>
                    <Link href={`/resources/${r.slug}/`} className="text-blue-700 hover:underline">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 text-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Indiana Compliance</h3>
              <p className="text-slate-600 mb-3">Need help understanding your requirements?</p>
              <Link href="/resources/indiana-backflow-testing-requirements/" className="text-blue-700 hover:underline">
                Read Indiana Requirements →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
