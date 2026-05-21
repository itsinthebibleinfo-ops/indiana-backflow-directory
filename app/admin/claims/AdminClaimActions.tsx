'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminClaimActions({
  claimId,
  providerId,
  status,
}: {
  claimId: string
  providerId: string | null
  status: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function action(newStatus: string) {
    setLoading(true)
    await fetch('/api/admin/claims', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: claimId, status: newStatus, provider_id: providerId }),
    })
    router.refresh()
    setLoading(false)
  }

  if (status !== 'pending') return null

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => action('approved')}
        className="text-xs px-2 py-1 rounded border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        disabled={loading}
        onClick={() => action('rejected')}
        className="text-xs px-2 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
