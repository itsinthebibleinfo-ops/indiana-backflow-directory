'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SERVICE_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Fire Sprinkler',
  'Irrigation',
]

const INDIANA_CITIES = [
  'Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel',
  'Fishers', 'Bloomington', 'Lafayette', 'Muncie', 'Terre Haute',
  'Gary', 'Noblesville', 'Greenwood', 'Anderson', 'Elkhart',
  'Kokomo', 'Mishawaka', 'Columbus', 'Jeffersonville', 'Lawrence',
]

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message?: string
}

export default function AddProviderPage() {
  const router = useRouter()
  const [state, setState] = useState<FormState>({ status: 'idle' })
  const [serviceTypes, setServiceTypes] = useState<string[]>([])
  const [serviceAreasInput, setServiceAreasInput] = useState('')

  function toggleServiceType(type: string) {
    setServiceTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState({ status: 'submitting' })

    const fd = new FormData(e.currentTarget)

    // Parse service_areas from comma-separated input
    const serviceAreas = serviceAreasInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const payload = {
      business_name: fd.get('business_name'),
      contact_name: fd.get('contact_name'),
      phone: fd.get('phone'),
      email: fd.get('email'),
      website: fd.get('website'),
      address: fd.get('address'),
      city: fd.get('city'),
      zip: fd.get('zip'),
      county: fd.get('county'),
      license_number: fd.get('license_number'),
      certification_type: fd.get('certification_type'),
      service_areas: serviceAreas,
      service_types: serviceTypes,
      is_verified: fd.get('is_verified') === 'on',
      is_featured: fd.get('is_featured') === 'on',
      is_active: fd.get('is_active') !== 'off',
      verification_notes: fd.get('verification_notes'),
    }

    try {
      const res = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/providers/')
        router.refresh()
      } else {
        const json = await res.json().catch(() => ({}))
        setState({ status: 'error', message: json.error || 'Failed to add provider.' })
      }
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' })
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/providers/" className="text-slate-500 hover:text-slate-700 text-sm">
          ← Back to Providers
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add Provider</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Business Info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">Business Information</h2>

          <div>
            <label className="form-label">Business Name *</label>
            <input name="business_name" type="text" required className="form-input" placeholder="ABC Backflow Testing LLC" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Contact Name</label>
              <input name="contact_name" type="text" className="form-input" placeholder="John Smith" />
            </div>
            <div>
              <label className="form-label">License / Cert #</label>
              <input name="license_number" type="text" className="form-input" placeholder="e.g. BT-12345" />
            </div>
          </div>

          <div>
            <label className="form-label">Certification Type</label>
            <input name="certification_type" type="text" className="form-input" placeholder="e.g. ASSE 5110, ABPA Certified" />
          </div>
        </div>

        {/* Contact */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">Contact Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone</label>
              <input name="phone" type="tel" className="form-input" placeholder="(317) 555-0000" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" placeholder="info@example.com" />
            </div>
          </div>

          <div>
            <label className="form-label">Website</label>
            <input name="website" type="url" className="form-input" placeholder="https://example.com" />
          </div>
        </div>

        {/* Location */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">Location</h2>

          <div>
            <label className="form-label">Street Address</label>
            <input name="address" type="text" className="form-input" placeholder="123 Main St" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="form-label">City *</label>
              <input
                name="city"
                type="text"
                required
                className="form-input"
                placeholder="Indianapolis"
                list="city-list"
              />
              <datalist id="city-list">
                {INDIANA_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="form-label">ZIP</label>
              <input name="zip" type="text" className="form-input" placeholder="46201" maxLength={10} />
            </div>
            <div>
              <label className="form-label">County</label>
              <input name="county" type="text" className="form-input" placeholder="Marion" />
            </div>
          </div>

          <div>
            <label className="form-label">Service Areas <span className="text-slate-400 font-normal">(comma-separated cities)</span></label>
            <input
              type="text"
              value={serviceAreasInput}
              onChange={e => setServiceAreasInput(e.target.value)}
              className="form-input"
              placeholder="Indianapolis, Carmel, Fishers, Noblesville"
            />
            <p className="text-xs text-slate-400 mt-1">These cities will show this provider on their directory pages.</p>
          </div>
        </div>

        {/* Service Types */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 text-base mb-3">Service Types</h2>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => toggleServiceType(type)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  serviceTypes.includes(type)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 text-base mb-3">Listing Status</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_active" defaultChecked className="rounded" />
              <span className="text-sm text-slate-700">Active <span className="text-slate-400">(visible on city pages)</span></span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_verified" className="rounded" />
              <span className="text-sm text-slate-700">Verified <span className="text-slate-400">(license confirmed)</span></span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_featured" className="rounded" />
              <span className="text-sm text-slate-700">Featured <span className="text-slate-400">(shown first)</span></span>
            </label>
          </div>

          <div className="mt-4">
            <label className="form-label">Internal Notes</label>
            <textarea name="verification_notes" rows={2} className="form-input resize-none" placeholder="How you verified this tester, source of info, etc." />
          </div>
        </div>

        {state.status === 'error' && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {state.message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={state.status === 'submitting'}
            className="btn-primary px-6 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {state.status === 'submitting' ? 'Saving…' : 'Add Provider'}
          </button>
          <Link href="/admin/providers/" className="btn-secondary px-6 py-2.5">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
