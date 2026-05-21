import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminLeadsPage() {
  const supabase = createAdminClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('*, cities(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Leads ({leads?.length || 0})</h1>
      {!leads || leads.length === 0 ? (
        <p className="text-slate-500">No leads yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                {['Name', 'Email', 'Phone', 'City', 'Property', 'Device', 'Urgency', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((l: Record<string, unknown>) => (
                <tr key={l.id as string} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{l.customer_name as string}</td>
                  <td className="px-3 py-2 text-slate-600">{l.email as string || '—'}</td>
                  <td className="px-3 py-2 text-slate-600">{l.phone as string || '—'}</td>
                  <td className="px-3 py-2">{(l.cities as { name: string } | null)?.name || '—'}</td>
                  <td className="px-3 py-2">{l.property_type as string || '—'}</td>
                  <td className="px-3 py-2">{l.device_type as string || '—'}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${l.urgency === 'Past due notice received' ? 'bg-red-100 text-red-800 font-semibold' : 'bg-slate-100 text-slate-700'}`}>
                      {l.urgency as string || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${l.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>
                      {l.status as string}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-400 whitespace-nowrap">{new Date(l.created_at as string).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
