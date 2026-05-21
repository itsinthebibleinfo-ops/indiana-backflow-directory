// Email adapter — swap out for any provider
// Currently supports Resend. Set RESEND_API_KEY to enable.

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 'your_resend_api_key') {
    console.log('[email] RESEND_API_KEY not configured — skipping send')
    console.log('[email] Would have sent:', payload.subject, '→', payload.to)
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)

  await resend.emails.send({
    from: payload.from || process.env.RESEND_FROM_EMAIL || 'noreply@indianabackflowtesting.com',
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  })
}

export function buildLeadNotificationHtml(lead: {
  customer_name: string
  email?: string | null
  phone?: string | null
  city?: string | null
  property_type?: string | null
  device_type?: string | null
  urgency?: string | null
  message?: string | null
}): string {
  return `
    <h2>New Backflow Testing Lead</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td><strong>Name</strong></td><td>${lead.customer_name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${lead.email || '—'}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${lead.phone || '—'}</td></tr>
      <tr><td><strong>City</strong></td><td>${lead.city || '—'}</td></tr>
      <tr><td><strong>Property Type</strong></td><td>${lead.property_type || '—'}</td></tr>
      <tr><td><strong>Device Type</strong></td><td>${lead.device_type || '—'}</td></tr>
      <tr><td><strong>Urgency</strong></td><td>${lead.urgency || '—'}</td></tr>
      <tr><td><strong>Message</strong></td><td>${lead.message || '—'}</td></tr>
    </table>
  `
}
