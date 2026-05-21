import Link from 'next/link'

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#0f2044] text-slate-300 mt-16">
      <div className="container-site py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-base mb-3">Indiana Backflow Directory</h3>
            <p className="text-sm leading-relaxed">
              Helping Indiana property owners find certified backflow prevention testers and stay compliant.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Find a Tester</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/backflow-testing/indiana/" className="hover:text-white transition-colors">Indiana Hub</Link></li>
              <li><Link href="/backflow-testing/indiana/indianapolis/" className="hover:text-white transition-colors">Indianapolis</Link></li>
              <li><Link href="/backflow-testing/indiana/fort-wayne/" className="hover:text-white transition-colors">Fort Wayne</Link></li>
              <li><Link href="/backflow-testing/indiana/carmel/" className="hover:text-white transition-colors">Carmel</Link></li>
              <li><Link href="/backflow-testing/indiana/fishers/" className="hover:text-white transition-colors">Fishers</Link></li>
              <li><Link href="/backflow-testing/indiana/" className="hover:text-white transition-colors">All Indiana Cities →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Services</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/services/irrigation-backflow-testing/" className="hover:text-white transition-colors">Irrigation Testing</Link></li>
              <li><Link href="/services/commercial-backflow-testing/" className="hover:text-white transition-colors">Commercial Testing</Link></li>
              <li><Link href="/services/residential-backflow-testing/" className="hover:text-white transition-colors">Residential Testing</Link></li>
              <li><Link href="/services/fire-line-backflow-testing/" className="hover:text-white transition-colors">Fire Line Testing</Link></li>
              <li><Link href="/services/annual-backflow-inspection/" className="hover:text-white transition-colors">Annual Inspection</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/resources/what-is-backflow-testing/" className="hover:text-white transition-colors">What Is Backflow Testing?</Link></li>
              <li><Link href="/resources/indiana-backflow-testing-requirements/" className="hover:text-white transition-colors">Indiana Requirements</Link></li>
              <li><Link href="/resources/backflow-testing-cost-indiana/" className="hover:text-white transition-colors">Cost in Indiana</Link></li>
              <li><Link href="/resources/failed-backflow-test-what-to-do/" className="hover:text-white transition-colors">Failed Test? What to Do</Link></li>
              <li><Link href="/claim-listing/" className="hover:text-white transition-colors">List Your Business</Link></li>
              <li><Link href="/request-backflow-test/" className="hover:text-white transition-colors">Request a Quote</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-400">
          <p>© {year} Indiana Backflow Testing Directory. All rights reserved.</p>
          <p className="max-w-md text-left sm:text-right">
            Listings are informational only. Always verify tester credentials directly and confirm they appear on your utility&rsquo;s approved list before hiring.
          </p>
        </div>
      </div>
    </footer>
  )
}
