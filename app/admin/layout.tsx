import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === process.env.ADMIN_SECRET
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0f2044] text-white flex flex-col">
        <div className="p-4 border-b border-blue-900">
          <Link href="/admin/" className="font-bold text-sm text-blue-300">
            Admin Dashboard
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          <Link href="/admin/" className="block px-3 py-2 rounded hover:bg-blue-900 transition-colors">Dashboard</Link>
          <Link href="/admin/leads/" className="block px-3 py-2 rounded hover:bg-blue-900 transition-colors">Leads</Link>
          <Link href="/admin/providers/" className="block px-3 py-2 rounded hover:bg-blue-900 transition-colors">Providers</Link>
          <Link href="/admin/claims/" className="block px-3 py-2 rounded hover:bg-blue-900 transition-colors">Claim Requests</Link>
        </nav>
        <div className="p-3 border-t border-blue-900">
          <Link href="/" className="text-xs text-blue-300 hover:text-white">← Back to Site</Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
