import type { Metadata } from 'next'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import LeadForm from '@/components/forms/LeadForm'
import ReminderForm from '@/components/forms/ReminderForm'
import { SERVICE_PAGES } from '@/lib/seo/cityContent'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Request Backflow Testing in Indiana',
  description: 'Submit a request to get connected with certified Indiana backflow testers. Fill out the quick form and a provider will contact you.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/request-backflow-test/`,
  },
}

export default function RequestPage() {
  return (
    <>
      <section className="bg-[#0f2044] text-white py-10">
        <div className="container-site">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Request Backflow Testing' }]} />
          <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-2">Request Backflow Testing in Indiana</h1>
          <p className="text-blue-100 max-w-xl">
            Tell us about your property and we&rsquo;ll connect you with certified Indiana testers who serve your area.
          </p>
        </div>
      </section>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              <LeadForm />
            </div>

            <div className="mt-8 card p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Set an Annual Reminder</h2>
              <p className="text-sm text-slate-600 mb-4">
                Don&rsquo;t miss next year&rsquo;s testing deadline. Enter your email and we&rsquo;ll remind you when it&rsquo;s time.
              </p>
              <ReminderForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-5 bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">⚠ Past-Due Notice?</h3>
              <p className="text-sm text-amber-800">
                If you&rsquo;ve received a notice from your water utility, act quickly. Select &ldquo;Past due notice received&rdquo; in the urgency field.
              </p>
            </div>

            <div className="card p-5 text-sm">
              <h3 className="font-semibold text-slate-900 mb-3">Service Types</h3>
              <ul className="space-y-1.5">
                {SERVICE_PAGES.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}/`} className="text-blue-700 hover:underline">{s.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 text-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Are You a Tester?</h3>
              <p className="text-slate-600 mb-3">Add your business to the directory to receive leads.</p>
              <Link href="/claim-listing/" className="btn-secondary text-sm w-full">
                Claim Your Listing
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
