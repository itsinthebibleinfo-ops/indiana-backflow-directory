'use client'
import { useState, useRef } from 'react'

interface LeadFormProps {
  citySlug?: string
  cityName?: string
  cityId?: string
  compact?: boolean
}

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message?: string
}

export default function LeadForm({ cityName, cityId, compact = false }: Omit<LeadFormProps, 'citySlug'> & { citySlug?: string }) {
  const [state, setState] = useState<FormState>({ status: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState({ status: 'submitting' })

    const formData = new FormData(e.currentTarget)

    // Honeypot check — if filled, silently succeed
    if (formData.get('website_url')) {
      setState({ status: 'success' })
      formRef.current?.reset()
      return
    }

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.get('customer_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          service_address: formData.get('service_address'),
          property_type: formData.get('property_type'),
          device_type: formData.get('device_type'),
          urgency: formData.get('urgency'),
          preferred_contact_method: formData.get('preferred_contact_method'),
          message: formData.get('message'),
          city_id: cityId || formData.get('city_id'),
          city_name: cityName || formData.get('city_name'),
        }),
      })

      if (res.ok) {
        setState({ status: 'success' })
        formRef.current?.reset()
      } else {
        const json = await res.json().catch(() => ({}))
        setState({ status: 'error', message: json.error || 'Something went wrong. Please try again.' })
      }
    } catch {
      setState({ status: 'error', message: 'Network error. Please check your connection and try again.' })
    }
  }

  if (state.status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="font-semibold text-green-900 text-lg mb-1">Request Submitted!</h3>
        <p className="text-green-800 text-sm">
          Your backflow testing request has been received. A certified tester from the directory may contact you soon.
        </p>
        <button
          className="mt-4 text-green-700 underline text-sm"
          onClick={() => setState({ status: 'idle' })}
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-name" className="form-label">Your Name *</label>
          <input
            id="lead-name"
            name="customer_name"
            type="text"
            required
            autoComplete="name"
            className="form-input"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="lead-phone" className="form-label">Phone</label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="form-input"
            placeholder="(317) 555-0000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-email" className="form-label">Email</label>
          <input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            className="form-input"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="lead-contact" className="form-label">Preferred Contact</label>
          <select id="lead-contact" name="preferred_contact_method" className="form-input">
            <option value="">Either</option>
            <option value="phone">Phone call</option>
            <option value="text">Text message</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lead-address" className="form-label">Service Address *</label>
        <input
          id="lead-address"
          name="service_address"
          type="text"
          required
          autoComplete="street-address"
          className="form-input"
          placeholder="123 Main St, Indianapolis, IN"
        />
      </div>

      {!cityId && (
        <div>
          <label htmlFor="lead-city" className="form-label">City *</label>
          <input
            id="lead-city"
            name="city_name"
            type="text"
            required
            className="form-input"
            placeholder="e.g. Indianapolis"
            defaultValue={cityName}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lead-property" className="form-label">Property Type *</label>
          <select id="lead-property" name="property_type" required className="form-input">
            <option value="">Select…</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
            <option>Church/Nonprofit</option>
            <option>School</option>
            <option>Restaurant</option>
            <option>Property Management</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="lead-device" className="form-label">Device Type</label>
          <select id="lead-device" name="device_type" className="form-input">
            <option value="">Unknown / Not Sure</option>
            <option>Irrigation</option>
            <option>Domestic</option>
            <option>Fire Sprinkler</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lead-urgency" className="form-label">How Soon Do You Need Testing?</label>
        <select id="lead-urgency" name="urgency" className="form-input">
          <option value="">Select…</option>
          <option>Just researching</option>
          <option>This month</option>
          <option>This week</option>
          <option>Past due notice received</option>
        </select>
      </div>

      {!compact && (
        <div>
          <label htmlFor="lead-message" className="form-label">Additional Notes</label>
          <textarea
            id="lead-message"
            name="message"
            rows={3}
            className="form-input resize-none"
            placeholder="Any details about your system, access notes, or special requirements…"
          />
        </div>
      )}

      {state.status === 'error' && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.status === 'submitting'}
        className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state.status === 'submitting' ? 'Submitting…' : 'Request Backflow Testing Quote'}
      </button>

      <p className="text-xs text-slate-500 text-center">
        This directory connects property owners with certified Indiana backflow testers. Your information is shared only with relevant providers.
      </p>
    </form>
  )
}
