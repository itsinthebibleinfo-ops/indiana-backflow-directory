'use client'
import { useState } from 'react'

export default function ReminderForm({ cityId, cityName }: { cityId?: string; cityName?: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)

    const res = await fetch('/api/remind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fd.get('email'),
        phone: fd.get('phone'),
        device_type: fd.get('device_type'),
        due_date: fd.get('due_date'),
        city_id: cityId,
        city_name: cityName,
        consent_to_reminders: true,
      }),
    })

    if (res.ok) {
      setStatus('success')
    } else {
      const j = await res.json().catch(() => ({}))
      setErrorMsg(j.error || 'Something went wrong.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center text-sm text-green-900">
        <strong>You&rsquo;re on the list!</strong> We&rsquo;ll remind you when your annual backflow test is coming up.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="remind-email" className="form-label">Email *</label>
        <input id="remind-email" name="email" type="email" required className="form-input" placeholder="you@example.com" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="remind-device" className="form-label">Device Type</label>
          <select id="remind-device" name="device_type" className="form-input">
            <option value="">Any</option>
            <option>Irrigation</option>
            <option>Domestic</option>
            <option>Fire Sprinkler</option>
          </select>
        </div>
        <div>
          <label htmlFor="remind-date" className="form-label">Approx. Due Date</label>
          <input id="remind-date" name="due_date" type="date" className="form-input" />
        </div>
      </div>
      {status === 'error' && <p className="text-red-600 text-xs">{errorMsg}</p>}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full btn-teal py-2.5 text-sm disabled:opacity-60"
      >
        {status === 'submitting' ? 'Saving…' : 'Set Annual Reminder'}
      </button>
      <p className="text-xs text-slate-400 text-center">No spam. Unsubscribe any time.</p>
    </form>
  )
}
