import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-site py-20 text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-3">Page Not Found</h1>
      <p className="text-slate-500 mb-8">
        This page doesn&rsquo;t exist. Try searching for a city or returning to the directory.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">Return to Homepage</Link>
        <Link href="/backflow-testing/indiana/" className="btn-secondary">Browse Indiana Directory</Link>
      </div>
    </div>
  )
}
