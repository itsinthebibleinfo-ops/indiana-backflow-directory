import Link from 'next/link'
import type { Provider } from '@/types'

interface ProviderCardProps {
  provider: Provider
  showServiceAreas?: boolean
}

export default function ProviderCard({ provider, showServiceAreas = false }: ProviderCardProps) {
  return (
    <article className="card-hover p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/providers/${provider.provider_slug}/`}
            className="font-semibold text-slate-900 hover:text-blue-700 transition-colors text-lg leading-tight block"
          >
            {provider.business_name}
          </Link>
          {(provider.city || provider.county) && (
            <p className="text-sm text-slate-500 mt-0.5">
              {[provider.city, provider.county ? `${provider.county} County` : null, 'IN']
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          {provider.is_verified && (
            <span className="badge-verified">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
          {provider.is_featured && (
            <span className="badge-featured">★ Featured</span>
          )}
          {!provider.is_verified && !provider.source_name?.includes('demo') && (
            <span className="text-xs text-slate-400">Unverified</span>
          )}
        </div>
      </div>

      {provider.license_number && (
        <p className="text-xs text-slate-500 mb-2">
          License: <span className="font-mono">{provider.license_number}</span>
          {provider.certification_type && ` · ${provider.certification_type}`}
        </p>
      )}

      {provider.service_types.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {provider.service_types.map((s) => (
            <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}

      {showServiceAreas && provider.service_areas.length > 0 && (
        <p className="text-xs text-slate-500 mb-3">
          Serves: {provider.service_areas.slice(0, 5).join(', ')}
          {provider.service_areas.length > 5 && ` + ${provider.service_areas.length - 5} more`}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {provider.phone && (
          <a
            href={`tel:${provider.phone.replace(/\D/g, '')}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition-colors"
            aria-label={`Call ${provider.business_name}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {provider.phone}
          </a>
        )}
        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-700 hover:underline py-1.5"
          >
            Website ↗
          </a>
        )}
        <Link
          href={`/providers/${provider.provider_slug}/`}
          className="text-sm text-blue-700 hover:underline py-1.5"
        >
          View Profile →
        </Link>
      </div>
    </article>
  )
}
