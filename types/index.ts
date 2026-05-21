export interface City {
  id: string
  name: string
  slug: string
  county: string | null
  state: string
  state_abbr: string
  water_utility: string | null
  enforcement_portal: string | null
  population: number | null
  latitude: number | null
  longitude: number | null
  seo_title: string | null
  seo_description: string | null
  intro_content: string | null
  created_at: string
  updated_at: string
}

export interface Provider {
  id: string
  business_name: string
  provider_slug: string
  contact_name: string | null
  license_number: string | null
  certification_type: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string
  zip: string | null
  county: string | null
  latitude: number | null
  longitude: number | null
  service_areas: string[]
  service_types: string[]
  is_verified: boolean
  is_featured: boolean
  is_active: boolean
  source_url: string | null
  source_name: string | null
  verification_notes: string | null
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  customer_name: string
  email: string | null
  phone: string | null
  property_type: string | null
  device_type: string | null
  service_address: string | null
  city_id: string | null
  preferred_contact_method: string | null
  urgency: string | null
  message: string | null
  status: string
  assigned_provider_id: string | null
  created_at: string
}

export interface ClaimRequest {
  id: string
  provider_id: string | null
  requester_name: string | null
  requester_email: string | null
  requester_phone: string | null
  verification_document_url: string | null
  status: string
  created_at: string
}

export interface ContentPage {
  id: string
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  content_markdown: string | null
  page_type: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  email: string
  phone: string | null
  city_id: string | null
  device_type: string | null
  due_date: string | null
  consent_to_reminders: boolean
  created_at: string
}

export interface ProviderCity {
  id: string
  provider_id: string
  city_id: string
  is_primary: boolean
}

export type PropertyType =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Church/Nonprofit'
  | 'School'
  | 'Restaurant'
  | 'Property Management'
  | 'Other'

export type DeviceType = 'Irrigation' | 'Domestic' | 'Fire Sprinkler' | 'Unknown'

export type UrgencyType =
  | 'This week'
  | 'This month'
  | 'Past due notice received'
  | 'Just researching'

export type ServiceType =
  | 'irrigation-backflow-testing'
  | 'commercial-backflow-testing'
  | 'residential-backflow-testing'
  | 'fire-line-backflow-testing'
  | 'annual-backflow-inspection'
