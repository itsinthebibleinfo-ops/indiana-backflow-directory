'use client'
import { useState, useEffect, useRef } from 'react'
import type { Provider } from '@/types'

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message?: string
}

export default function ClaimForm() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Provider[]>([])
  const [selected, setSelected] = useState<Provider | null>(null)
  const [isNewListing, setIsNewListing] = useState(false)
  const [state, setState] = useState<FormState>({ status: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.length < 2) {
        setResults([])
        return
      }
      const res = await fetch(`/api/providers?q=${encodeURIComponent(search)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.providers || [])
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [search])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState({ status: 'submitting' })
    const fd = new FormData(e.currentTarget)

    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider_id: selected?.id || null,
        requester_name: fd.get('requester_name'),
        requester_email: fd.get('requester_email'),
        requester_phone: fd.get('requester_phone'),
        business_name: fd.get('business_name'),
        license_number: fd.get('license_number'),
        city: fd.get('city'),
        phone: fd.get('phone'),
        website: fd.get('website'),
        verification_document_url: fd.get('verification_document_url'),
        is_new_listing: isNewListing,
      }),
    })

    if (res.ok) {
      setState({ status: 'success' })
      formRef.current?.reset()
    } else {
      const j = await res.json().catch(() => ({}))
      setState({ status: 'error', message: j.error || 'Submission failed. Please try again.' })
    }
  }

  if (state.status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✓</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Claim Request Submitted</h2>
        <p className="text-slate-600">
          Our team will review your claim and contact you at the email provided, typically within 1–3 business days.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-bold text-slate-900">Business Information</h2>

      {/* Search existing */}
      {!isNewListing && (
        <div>
          <label className="form-label">Search for Your Business</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            placeholder="Enter your business name…"
          />
          {results.length > 0 && (
            <ul className="border border-slate-200 rounded-lg mt-1 divide-y divide-slate-100 bg-white shadow-sm">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                    onClick={() => { setSelected(p); setSearch(p.business_name); setResults([]) }}
                  >
                    <span className="font-medium text-slate-900">{p.business_name}</span>
                    <span className="text-xs text-slate-500 ml-2">{p.city}, IN</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selected && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span>Selected: <strong>{selected.business_name}</strong></span>
              <button type="button" onClick={() => { setSelected(null); setSearch('') }} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
            </div>
          )}
          <button
            type="button"
            className="mt-2 text-sm text-blue-700 hover:underline"
            onClick={() => setIsNewListing(true)}
          >
            My business isn&rsquo;t listed — add a new listing
          </button>
        </div>
      )}

      {isNewListing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">New Listing Details</h3>
            <button type="button" className="text-sm text-blue-700 hover:underline" onClick={() => setIsNewListing(false)}>
              Search existing listings
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Business Name *</label>
              <input name="business_name" type="text" required className="form-input" />
            </div>
            <div>
              <label className="form-label">License / Cert Number</label>
              <input name="license_number" type="text" className="form-input" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">City</label>
              <input name="city" type="text" className="form-input" placeholder="e.g. Indianapolis" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input name="phone" type="tel" className="form-input" />
            </div>
          </div>
          <div>
            <label className="form-label">Website</label>
            <input name="website" type="url" className="form-input" placeholder="https://..." />
          </div>
        </div>
      )}

      <hr className="border-slate-200" />
      <h2 className="text-lg font-bold text-slate-900">Your Contact Info</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Your Name *</label>
          <input name="requester_name" type="text" required className="form-input" />
        </div>
        <div>
          <label className="form-label">Your Email *</label>
          <input name="requester_email" type="email" required className="form-input" />
        </div>
      </div>
      <div>
        <label className="form-label">Your Phone</label>
        <input name="requester_phone" type="tel" className="form-input" />
      </div>

      <div>
        <label className="form-label">Certification / License URL (optional)</label>
        <input
          name="verification_document_url"
          type="url"
          className="form-input"
          placeholder="Link to public certification record or document"
        />
        <p className="text-xs text-slate-400 mt-1">
          A link to your state certification, utility approval letter, or another verifiable document speeds up approval.
        </p>
      </div>

      {state.status === 'error' && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === 'submitting' || (!selected && !isNewListing)}
        className="w-full btn-primary py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state.status === 'submitting' ? 'Submitting…' : 'Submit Claim Request'}
      </button>

      <p className="text-xs text-slate-400">
        By submitting, you confirm you are the authorized representative of this business and that the information provided is accurate.
      </p>
    </form>
  )
}
