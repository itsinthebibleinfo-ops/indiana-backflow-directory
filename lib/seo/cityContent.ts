import type { City, Provider } from '@/types'

export interface CityContentData {
  city: City
  providers: Provider[]
  nearbyCount?: number
}

export interface GeneratedCityContent {
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  complianceSection: string
  utilitySection: string | null
  faqItems: Array<{ question: string; answer: string }>
  h2Sections: Array<{ heading: string; body: string }>
}

export function generateCityContent(data: CityContentData): GeneratedCityContent {
  const { city, providers } = data
  const verifiedCount = providers.filter((p) => p.is_verified).length
  const totalCount = providers.length

  const metaTitle =
    city.seo_title ||
    `Backflow Testing in ${city.name}, IN | Certified Indiana Testers`

  const metaDescription =
    city.seo_description ||
    `Find certified backflow testers in ${city.name}, Indiana. Compare licensed providers for irrigation, commercial, residential, and fire line backflow testing. Request a quote today.`

  const h1 = `Certified Backflow Testing in ${city.name}, Indiana`

  const intro =
    city.intro_content ||
    `If you own or manage property in ${city.name}, Indiana, annual backflow prevention testing is likely required by your water utility or local ordinance. Backflow events can contaminate the public water supply — which is why Indiana regulators and most water utilities require certified testers to inspect and report on your backflow prevention device every year.

${city.water_utility ? `${city.water_utility} serves most of ${city.name} and requires annual backflow testing for qualifying assemblies. ` : ''}Use this directory to find licensed, state-certified backflow testers serving ${city.name}${city.county ? `, ${city.county} County` : ''}.`

  const complianceSection = `Indiana follows IDEM guidelines and adopts the American Water Works Association (AWWA) standards for backflow prevention. Property owners with irrigation systems, commercial connections, or fire sprinkler systems are typically required to have their assemblies tested annually by a state-certified tester. Failure to comply may result in water service interruption or fines.${city.enforcement_portal ? ` Submit your test report through the ${city.enforcement_portal}.` : ''}`

  const utilitySection = city.water_utility
    ? `**${city.water_utility}** is the primary water utility serving ${city.name}. They require annual backflow assembly test reports for cross-connection control compliance. Contact your utility directly to confirm your specific testing schedule and approved tester list.`
    : null

  const faqItems = generateCityFAQs(city, totalCount, verifiedCount)
  const h2Sections = generateH2Sections(city, totalCount)

  return {
    metaTitle,
    metaDescription,
    h1,
    intro,
    complianceSection,
    utilitySection,
    faqItems,
    h2Sections,
  }
}

function generateCityFAQs(
  city: City,
  totalCount: number,
  verifiedCount: number
): Array<{ question: string; answer: string }> {
  return [
    {
      question: `Is backflow testing required in ${city.name}, Indiana?`,
      answer: `Yes. Most commercial, industrial, and residential properties with irrigation systems or high-hazard connections in ${city.name} are required to have their backflow prevention assemblies tested annually. Requirements are enforced by ${city.water_utility || 'your local water utility'} and follow Indiana Department of Environmental Management (IDEM) guidelines.`,
    },
    {
      question: `How much does backflow testing cost in ${city.name}?`,
      answer: `Backflow testing in ${city.name}, IN typically costs between $75 and $200 per assembly, depending on the type of device, accessibility, and the provider. Commercial systems with multiple assemblies or large RPZ devices may cost more. Request a quote from a certified tester listed in this directory for accurate pricing.`,
    },
    {
      question: `Who is certified to perform backflow testing in Indiana?`,
      answer: `Indiana requires backflow testers to be certified through an ASSE-accredited program. Look for testers with ASSE 5110 or 5120 certification, or utility-approved credentials. ${verifiedCount > 0 ? `This directory includes ${verifiedCount} verified certified tester${verifiedCount !== 1 ? 's' : ''} serving ${city.name}.` : 'Always ask your tester to provide their certification number before hiring.'}`,
    },
    {
      question: `What happens if I miss my backflow testing deadline?`,
      answer: `Missed backflow testing deadlines can result in a notice of non-compliance from your water utility, service interruption, or fines. If you've received a past-due notice, contact a certified tester immediately. Most testers can accommodate urgent scheduling. Use this directory to find a tester who serves ${city.name}.`,
    },
    {
      question: `What types of properties need backflow testing in ${city.name}?`,
      answer: `Backflow prevention testing is typically required for commercial and industrial properties, properties with irrigation systems, fire sprinkler systems, and any connection with a potential cross-connection hazard. Some residential properties with irrigation may also be required to test annually. Contact ${city.water_utility || 'your water utility'} to confirm your requirements.`,
    },
  ]
}

function generateH2Sections(
  city: City,
  totalCount: number
): Array<{ heading: string; body: string }> {
  return [
    {
      heading: `Indiana Backflow Testing Requirements for ${city.name} Property Owners`,
      body: `Indiana's cross-connection control rules require that backflow prevention assemblies be tested by a state-certified tester at least once per year. Test reports must be submitted to your water utility within the required timeframe — typically 30 to 60 days of the due date. Failure to comply may result in water service interruption.`,
    },
    {
      heading: `Types of Backflow Testing Available in ${city.name}`,
      body: `Certified testers in ${city.name} typically offer testing for reduced pressure zone (RPZ) assemblies, double check valve assemblies (DCVA), pressure vacuum breakers (PVB), and atmospheric vacuum breakers. Common service types include irrigation system backflow testing, commercial backflow testing, domestic water line testing, and fire line backflow testing.`,
    },
    {
      heading: `How to Choose a Certified Backflow Tester in ${city.name}`,
      body: `When selecting a backflow tester, verify their state certification number, confirm they are on your utility's approved tester list, ask about their testing fee and turnaround time for report submission, and read reviews. ${totalCount > 0 ? `This directory currently lists ${totalCount} provider${totalCount !== 1 ? 's' : ''} serving ${city.name}.` : 'Be sure to verify credentials directly with the provider before hiring.'}`,
    },
  ]
}

export function buildCityJsonLd(
  city: City,
  providers: Provider[],
  siteUrl: string
): object[] {
  const cityUrl = `${siteUrl}/backflow-testing/indiana/${city.slug}/`

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Indiana Backflow Testing',
        item: `${siteUrl}/backflow-testing/indiana/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${city.name}, IN`,
        item: cityUrl,
      },
    ],
  }

  const faqItems = generateCityFAQs(city, providers.length, providers.filter((p) => p.is_verified).length)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const providerSchemas = providers.slice(0, 10).map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: p.business_name,
    url: p.website || `${siteUrl}/providers/${p.provider_slug}/`,
    telephone: p.phone || undefined,
    address: p.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: p.address,
          addressLocality: p.city || city.name,
          addressRegion: 'IN',
          postalCode: p.zip || undefined,
          addressCountry: 'US',
        }
      : undefined,
  }))

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Certified Backflow Testers in ${city.name}, Indiana`,
    itemListElement: providers.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.business_name,
      url: `${siteUrl}/providers/${p.provider_slug}/`,
    })),
  }

  return [breadcrumb, faqSchema, itemList, ...providerSchemas]
}

export const SERVICE_PAGES = [
  { slug: 'irrigation-backflow-testing', label: 'Irrigation Backflow Testing' },
  { slug: 'commercial-backflow-testing', label: 'Commercial Backflow Testing' },
  { slug: 'residential-backflow-testing', label: 'Residential Backflow Testing' },
  { slug: 'fire-line-backflow-testing', label: 'Fire Line Backflow Testing' },
  { slug: 'annual-backflow-inspection', label: 'Annual Backflow Inspection' },
]

export const RESOURCE_PAGES = [
  { slug: 'what-is-backflow-testing', label: 'What Is Backflow Testing?' },
  { slug: 'indiana-backflow-testing-requirements', label: 'Indiana Requirements' },
  { slug: 'how-often-is-backflow-testing-required', label: 'How Often Is Testing Required?' },
  { slug: 'backflow-testing-cost-indiana', label: 'Cost of Backflow Testing in Indiana' },
  { slug: 'backflow-prevention-device-types', label: 'Device Types Explained' },
  { slug: 'failed-backflow-test-what-to-do', label: 'What to Do After a Failed Test' },
]
