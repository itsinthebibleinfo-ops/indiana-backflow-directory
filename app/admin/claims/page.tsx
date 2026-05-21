import { createAdminClient } from '@/lib/supabase/admin'
import AdminClaimActions from './AdminClaimActions'

export const dynamic = 'force-dynamic'

export default async function AdminClaimsPage() {
  const supabase = createAdminClient()
  const { data: claims } = await supabase
    .from('claim_requests')
    .select('*, providers(business_name)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Claim Requests ({claims?.length || 0})</h1>
      {!claims || claims.length === 0 ? (
        <p className="text-slate-500">No claim requests yet.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((c: Record<string, unknown>) => {
            const provider = c.providers as { business_name: string } | null
            return (
              <div key={c.id as string} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {provider?.business_name || '(New listing)'}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Requester: {c.requester_name as string} — {c.requester_email as string}
                      {c.requester_phone ? ` — ${c.requester_phone}` : ''}
                    </p>
                    {Boolean(c.verification_document_url) && (
                      <a
                        href={c.verification_document_url as string}
                        className="text-xs text-blue-700 hover:underline mt-1 inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View verification document ↗
                      </a>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      Submitted {new Date(c.created_at as string).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      c.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      c.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {c.status as string}
                    </span>
                    <AdminClaimActions claimId={c.id as string} providerId={c.provider_id as string | null} status={c.status as string} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
