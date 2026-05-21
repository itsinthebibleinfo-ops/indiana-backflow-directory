'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  providerId: string
  isVerified: boolean
  isFeatured: boolean
  isActive: boolean
}

export default function AdminProviderActions({ providerId, isVerified, isFeatured, isActive }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle(field: 'is_verified' | 'is_featured' | 'is_active', current: boolean) {
    setLoading(true)
    await fetch('/api/admin/providers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: providerId, [field]: !current }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex gap-1">
      <button
        disabled={loading}
        onClick={() => toggle('is_verified', isVerified)}
        className={`text-xs px-2 py-1 rounded border transition-colors ${isVerified ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
      >
        {isVerified ? 'Unverify' : 'Verify'}
      </button>
      <button
        disabled={loading}
        onClick={() => toggle('is_featured', isFeatured)}
        className={`text-xs px-2 py-1 rounded border transition-colors ${isFeatured ? 'border-slate-300 text-slate-600 hover:bg-slate-50' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
      >
        {isFeatured ? 'Unfeature' : 'Feature'}
      </button>
      <button
        disabled={loading}
        onClick={() => toggle('is_active', isActive)}
        className={`text-xs px-2 py-1 rounded border transition-colors ${isActive ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  )
}
