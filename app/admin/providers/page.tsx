import { createAdminClient } from '@/lib/supabase/admin'
import AdminProviderActions from './AdminProviderActions'

export const dynamic = 'force-dynamic'

export default async function AdminProvidersPage() {
  const supabase = createAdminClient()
  const { data: providers } = await supabase
    .from('providers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Providers ({providers?.length || 0})</h1>
      {!providers || providers.length === 0 ? (
        <p className="text-slate-500">No providers yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                {['Business', 'City', 'License', 'Active', 'Verified', 'Featured', 'Actions'].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {providers.map((p: Record<string, unknown>) => (
                <tr key={p.id as string} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium max-w-xs truncate">{p.business_name as string}</td>
                  <td className="px-3 py-2 text-slate-600">{p.city as string || '—'}</td>
                  <td className="px-3 py-2 font-mono text-xs">{p.license_number as string || '—'}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                      {p.is_active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${p.is_verified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {p.is_verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${p.is_featured ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'}`}>
                      {p.is_featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <AdminProviderActions
                      providerId={p.id as string}
                      isVerified={p.is_verified as boolean}
                      isFeatured={p.is_featured as boolean}
                      isActive={p.is_active as boolean}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
