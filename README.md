# Indiana Backflow Testing Directory

A programmatic SEO directory connecting Indiana property owners with certified backflow prevention testers.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Postgres) · Resend · Zod

---

## Setup Instructions

### 1. Install

```bash
cd indiana-backflow-directory
npm install
```

### 2. Environment variables

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_SITE_URL=https://indianabackflowtesting.com

RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@indianabackflowtesting.com
LEAD_NOTIFICATION_EMAIL=admin@indianabackflowtesting.com

ADMIN_SECRET=change_this_to_a_long_random_secret
```

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, paste and run:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, RLS policies, and triggers.

### 4. Seed cities

```bash
npm run seed:cities
```

Inserts 20 Indiana seed cities with county, utility, and geo data.

### 5. Import provider data

```bash
# Validate your source file first
npm run validate:providers -- --source=./data/providers.json

# Import
npm run import:providers -- --source=./data/providers.json

# For IDEM/utility CSV sources
npm run parse:idem -- --source=./data/idem-testers.csv --output=./data/providers.json
npm run import:providers -- --source=./data/providers.json
```

**Data ethics:** Only import public/official/provider-submitted data. Each record must include `source_url` and `source_name`.

### 6. Run locally

```bash
npm run dev
```

---

## Site Architecture

| URL | Page |
|-----|------|
| `/` | Homepage |
| `/backflow-testing/indiana/` | State hub |
| `/backflow-testing/indiana/[city-slug]/` | City pages (dynamic) |
| `/backflow-testing/indiana/counties/[county-slug]/` | County pages |
| `/services/[service-slug]/` | Service type pages |
| `/providers/[provider-slug]/` | Provider profiles |
| `/resources/[slug]/` | Resource/educational pages |
| `/request-backflow-test/` | Lead capture |
| `/claim-listing/` | Provider claim form |
| `/admin/` | Admin dashboard |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Robots file |

---

## Admin Dashboard

Visit `/admin/login` and enter `ADMIN_SECRET`. Then use `/admin/` to:
- View leads with urgency and status
- Verify/feature/activate providers
- Approve or reject claim requests

---

## Deployment (Vercel)

1. Push repo to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Set all env vars
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain
5. Deploy

---

## SEO Launch Checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] `sitemap.xml` accessible and submitted to Google Search Console
- [ ] `robots.txt` verified
- [ ] JSON-LD tested with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Lighthouse 90+ on all four metrics
- [ ] Canonical URLs consistent (trailing slash)
- [ ] Real provider data imported
- [ ] Custom `intro_content` added to top 20 city rows in DB
- [ ] Resend configured for lead emails
- [ ] Lead form and claim form tested end-to-end
- [ ] Admin dashboard access verified

---

## Data Ethics & Crawling Rules

- Only ingest public/official/provider-submitted data
- Always set `source_url` and `source_name` on imported records
- Never scrape gated, private, or copyrighted data without permission
- Mark placeholder/demo providers with `source_name: 'demo'`
- Respect `robots.txt` of any reference source

---

## Features Requiring External Config

| Feature | Requirement |
|---------|------------|
| Lead email notifications | `RESEND_API_KEY` |
| Annual reminder emails | `RESEND_API_KEY` + cron job (schema ready) |
| Provider data | Import scripts + public IDEM/utility source |
| Admin dashboard | `ADMIN_SECRET` env var |

---

## Next Steps After Launch

1. Import real IDEM-certified tester data
2. Add `intro_content` to top city rows for unique content
3. Set up Resend for email notifications
4. Build reminder email cron job (DB schema is in place)
5. Reach out to certified Indiana testers to claim listings
6. Monitor Search Console for rankings and CTR
