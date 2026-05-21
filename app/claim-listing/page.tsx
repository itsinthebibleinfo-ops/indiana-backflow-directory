import type { Metadata } from 'next'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ClaimForm from '@/components/forms/ClaimForm'

export const metadata: Metadata = {
  title: 'Claim Your Backflow Testing Listing | Indiana Directory',
  description: 'Are you a certified Indiana backflow tester? Claim or add your listing to the Indiana Backflow Testing Directory and start receiving leads.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/claim-listing/`,
  },
}

export default function ClaimListingPage() {
  return (
    <>
      <section className="bg-[#0f2044] text-white py-10">
        <div className="container-site">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Claim Your Listing' }]} />
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">Claim Your Listing</h1>
          <p className="text-blue-100 max-w-xl">
            Certified Indiana backflow testers — claim or add your business listing to start appearing in search results and receiving quote requests.
          </p>
        </div>
      </section>

      <div className="container-site py-10 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">🔍</div>
            <div className="text-sm font-semibold text-slate-900">1. Find Your Listing</div>
            <div className="text-xs text-slate-500 mt-1">Search for your business name</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-sm font-semibold text-slate-900">2. Submit Claim</div>
            <div className="text-xs text-slate-500 mt-1">Provide contact & certification info</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl mb-1">✓</div>
            <div className="text-sm font-semibold text-slate-900">3. Get Verified</div>
            <div className="text-xs text-slate-500 mt-1">Our team reviews & approves</div>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <ClaimForm />
        </div>
      </div>
    </>
  )
}
