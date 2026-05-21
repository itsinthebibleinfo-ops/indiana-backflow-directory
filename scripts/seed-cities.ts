import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CITIES = [
  {
    name: 'Indianapolis',
    slug: 'indianapolis',
    county: 'Marion',
    water_utility: 'Citizens Energy Group',
    enforcement_portal: 'https://www.citizensenergygroup.com',
    population: 887642,
    latitude: 39.7684,
    longitude: -86.1581,
    seo_title: 'Backflow Testing in Indianapolis, IN | Certified Indiana Testers',
    seo_description: 'Find certified backflow testers in Indianapolis, Indiana. Compare licensed providers for irrigation, commercial, and fire line backflow testing.',
  },
  {
    name: 'Fort Wayne',
    slug: 'fort-wayne',
    county: 'Allen',
    water_utility: 'City of Fort Wayne Utilities',
    population: 268378,
    latitude: 41.0793,
    longitude: -85.1394,
    seo_title: 'Backflow Testing in Fort Wayne, IN | Certified Testers',
    seo_description: 'Certified backflow prevention testers in Fort Wayne, Indiana. Annual testing for irrigation, commercial, and residential systems.',
  },
  {
    name: 'Evansville',
    slug: 'evansville',
    county: 'Vanderburgh',
    water_utility: 'Indiana American Water',
    population: 118414,
    latitude: 37.9748,
    longitude: -87.5558,
  },
  {
    name: 'South Bend',
    slug: 'south-bend',
    county: 'St. Joseph',
    water_utility: 'South Bend Water Works',
    population: 103453,
    latitude: 41.6764,
    longitude: -86.2520,
  },
  {
    name: 'Carmel',
    slug: 'carmel',
    county: 'Hamilton',
    water_utility: 'Carmel Utilities',
    population: 101068,
    latitude: 39.9784,
    longitude: -86.1180,
    seo_title: 'Backflow Testing in Carmel, IN | Certified Indiana Testers',
    seo_description: 'Find certified backflow testers in Carmel, Indiana (Hamilton County). Request quotes from licensed providers for residential and commercial testing.',
  },
  {
    name: 'Fishers',
    slug: 'fishers',
    county: 'Hamilton',
    water_utility: 'Fishers Utilities',
    population: 99451,
    latitude: 39.9570,
    longitude: -86.0152,
  },
  {
    name: 'Bloomington',
    slug: 'bloomington',
    county: 'Monroe',
    water_utility: 'City of Bloomington Utilities',
    population: 79168,
    latitude: 39.1653,
    longitude: -86.5264,
  },
  {
    name: 'Lafayette',
    slug: 'lafayette',
    county: 'Tippecanoe',
    water_utility: 'Indiana American Water (Lafayette)',
    population: 74171,
    latitude: 40.4167,
    longitude: -86.8753,
  },
  {
    name: 'Muncie',
    slug: 'muncie',
    county: 'Delaware',
    water_utility: 'Muncie Sanitary District',
    population: 65000,
    latitude: 40.1934,
    longitude: -85.3863,
  },
  {
    name: 'Terre Haute',
    slug: 'terre-haute',
    county: 'Vigo',
    water_utility: 'Indiana American Water (Terre Haute)',
    population: 58000,
    latitude: 39.4667,
    longitude: -87.4139,
  },
  {
    name: 'Gary',
    slug: 'gary',
    county: 'Lake',
    water_utility: 'Gary Sanitary District',
    population: 70000,
    latitude: 41.5934,
    longitude: -87.3462,
  },
  {
    name: 'Noblesville',
    slug: 'noblesville',
    county: 'Hamilton',
    water_utility: 'Noblesville Utilities',
    population: 75000,
    latitude: 40.0456,
    longitude: -86.0086,
  },
  {
    name: 'Greenwood',
    slug: 'greenwood',
    county: 'Johnson',
    water_utility: 'Greenwood Utilities',
    population: 65000,
    latitude: 39.6137,
    longitude: -86.1067,
  },
  {
    name: 'Anderson',
    slug: 'anderson',
    county: 'Madison',
    water_utility: 'Indiana American Water (Anderson)',
    population: 54000,
    latitude: 40.1053,
    longitude: -85.6803,
  },
  {
    name: 'Elkhart',
    slug: 'elkhart',
    county: 'Elkhart',
    water_utility: 'Elkhart Utilities',
    population: 53000,
    latitude: 41.6820,
    longitude: -85.9766,
  },
  {
    name: 'Kokomo',
    slug: 'kokomo',
    county: 'Howard',
    water_utility: 'City of Kokomo Water & Sewer',
    population: 58000,
    latitude: 40.4864,
    longitude: -86.1336,
  },
  {
    name: 'Mishawaka',
    slug: 'mishawaka',
    county: 'St. Joseph',
    water_utility: 'Mishawaka Utilities',
    population: 50000,
    latitude: 41.6617,
    longitude: -86.1586,
  },
  {
    name: 'Columbus',
    slug: 'columbus',
    county: 'Bartholomew',
    water_utility: 'Columbus Utilities',
    population: 50000,
    latitude: 39.2014,
    longitude: -85.9214,
  },
  {
    name: 'Jeffersonville',
    slug: 'jeffersonville',
    county: 'Clark',
    water_utility: 'Ohio Valley Water Company',
    population: 50000,
    latitude: 38.2776,
    longitude: -85.7372,
  },
  {
    name: 'Lawrence',
    slug: 'lawrence',
    county: 'Marion',
    water_utility: 'Citizens Energy Group',
    population: 50000,
    latitude: 39.8386,
    longitude: -86.0253,
  },
]

async function seed() {
  console.log('Seeding cities...')

  for (const city of CITIES) {
    const { error } = await supabase
      .from('cities')
      .upsert(
        { ...city, state: 'Indiana', state_abbr: 'IN' },
        { onConflict: 'slug' }
      )

    if (error) {
      console.error(`Failed to insert ${city.name}:`, error.message)
    } else {
      console.log(`✓ ${city.name}`)
    }
  }

  console.log('\nCity seeding complete.')
}

seed().catch(console.error)
