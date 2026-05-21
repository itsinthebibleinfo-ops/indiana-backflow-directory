import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [leads, providers, claims] = await Promise.all([
    supabase.from('leads').select('id, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('providers').select('id, is_verified, is_active'),
    supabase.from('claim_requests').select('id, status').eq('status', 'pending'),
  ])

  const newLeads = leads.data?.filter((l: { status: string }) => l.status === 'new').length || 0
  const totalProviders = providers.data?.length || 0
  const verifiedProviders = providers.data?.filter((p: { is_verified: boolean }) => p.is_verified).length || 0
  const pendingClaims = claims.data?.length || 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="text-3xl font-bold text-blue-700">{newLeads}</div>
          <div className="text-sm text-slate-600 mt-1">New Leads</div>
          <a href="/admin/leads/" className="text-xs text-blue-700 hover:underline mt-2 inline-block">View all →</a>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-bold text-blue-700">{totalProviders}</div>
          <div className="text-sm text-slate-600 mt-1">Total Providers ({verifiedProviders} verified)</div>
          <a href="/admin/providers/" className="text-xs text-blue-700 hover:underline mt-2 inline-block">Manage →</a>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-bold text-amber-600">{pendingClaims}</div>
          <div className="text-sm text-slate-600 mt-1">Pending Claim Requests</div>
          <a href="/admin/claims/" className="text-xs text-blue-700 hover:underline mt-2 inline-block">Review →</a>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-3">Recent Leads</h2>
      {leads.data && leads.data.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.data.map((lead: { id: string; status: string; created_at: string }) => (
                <tr key={lead.id}>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${lead.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No leads yet.</p>
      )}
    </div>
  )
}
