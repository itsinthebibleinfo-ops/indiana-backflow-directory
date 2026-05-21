// Email adapter — Gmail SMTP via Nodemailer
// Requires: GMAIL_USER (your Gmail address) + GMAIL_APP_PASSWORD (16-char App Password)
// Setup: Google Account → Security → 2-Step Verification → App passwords → create one for "Mail"

export interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.log('[email] GMAIL_USER / GMAIL_APP_PASSWORD not configured — skipping send')
    console.log('[email] Would have sent:', payload.subject, '→', payload.to)
    return
  }

  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.default.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: payload.from || `"Indiana Backflow Directory" <${user}>`,
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
  const urgencyStyle =
    lead.urgency === 'Past due notice received'
      ? 'background:#fee2e2;color:#991b1b;font-weight:bold;padding:4px 8px;border-radius:4px;'
      : ''

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0f2044;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;font-size:18px;">🔔 New Backflow Testing Lead</h2>
      </div>
      <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;width:140px;">Name</td>
            <td style="padding:8px 12px;color:#0f172a;">${lead.customer_name}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Phone</td>
            <td style="padding:8px 12px;color:#0f172a;">${lead.phone || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Email</td>
            <td style="padding:8px 12px;color:#0f172a;">${lead.email || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">City</td>
            <td style="padding:8px 12px;color:#0f172a;">${lead.city || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Property</td>
            <td style="padding:8px 12px;color:#0f172a;">${lead.property_type || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Device</td>
            <td style="padding:8px 12px;color:#0f172a;">${lead.device_type || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Urgency</td>
            <td style="padding:8px 12px;"><span style="${urgencyStyle}">${lead.urgency || '—'}</span></td>
          </tr>
          ${lead.message ? `
          <tr>
            <td style="padding:8px 12px;font-weight:600;color:#475569;vertical-align:top;">Notes</td>
            <td style="padding:8px 12px;color:#0f172a;">${lead.message}</td>
          </tr>` : ''}
        </table>
        <div style="margin-top:20px;text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/leads/"
             style="background:#1d4ed8;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">
            View All Leads →
          </a>
        </div>
      </div>
    </div>
  `
}

export function buildClaimNotificationHtml(claim: {
  requester_name?: string | null
  requester_email?: string | null
  requester_phone?: string | null
  business_name?: string | null
  license_number?: string | null
  city?: string | null
}): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0f2044;color:white;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h2 style="margin:0;font-size:18px;">📋 New Listing Claim Request</h2>
      </div>
      <div style="background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;width:160px;">Business</td>
            <td style="padding:8px 12px;color:#0f172a;">${claim.business_name || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Contact Name</td>
            <td style="padding:8px 12px;color:#0f172a;">${claim.requester_name || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Phone</td>
            <td style="padding:8px 12px;color:#0f172a;">${claim.requester_phone || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Email</td>
            <td style="padding:8px 12px;color:#0f172a;">${claim.requester_email || '—'}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">License #</td>
            <td style="padding:8px 12px;color:#0f172a;">${claim.license_number || '—'}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:600;color:#475569;">City</td>
            <td style="padding:8px 12px;color:#0f172a;">${claim.city || '—'}</td>
          </tr>
        </table>
        <div style="margin-top:20px;text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || ''}/admin/claims/"
             style="background:#d97706;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">
            Review Claim →
          </a>
        </div>
      </div>
    </div>
  `
}
