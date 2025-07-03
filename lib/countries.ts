export interface Country {
  name: string
  code: string
  flag: string
  cities?: string[]
}

export interface ContactSource {
  value: string
  label: string
  icon?: string
}

export const countries: Country[] = [
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' }
]

export const contactSources: ContactSource[] = [
  { value: "Website", label: "🌐 Website" },
  { value: "Referral", label: "👥 Referral" },
  { value: "Cold Call", label: "📞 Cold Call" },
  { value: "Social Media", label: "📱 Social Media" },
  { value: "Trade Show", label: "🎪 Trade Show" },
  { value: "Other", label: "📋 Other" }
]

const citiesByCountry: Record<string, string[]> = {
  CN: [
    'Beijing',
    'Shanghai',
    'Guangzhou',
    'Shenzhen',
    'Chengdu',
    'Hangzhou',
    'Nanjing',
    'Wuhan',
    'Tianjin',
    'Xian'
  ],
  US: [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose'
  ],
  GB: [
    'London',
    'Birmingham',
    'Leeds',
    'Glasgow',
    'Sheffield',
    'Manchester',
    'Liverpool',
    'Bristol',
    'Cardiff',
    'Belfast'
  ],
  DE: [
    'Berlin',
    'Hamburg',
    'Munich',
    'Cologne',
    'Frankfurt',
    'Stuttgart',
    'Düsseldorf',
    'Dortmund',
    'Essen',
    'Leipzig'
  ],
  FR: [
    'Paris',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille'
  ],
  JP: [
    'Tokyo',
    'Yokohama',
    'Osaka',
    'Nagoya',
    'Sapporo',
    'Fukuoka',
    'Kobe',
    'Kyoto',
    'Kawasaki',
    'Saitama'
  ],
  KR: [
    'Seoul',
    'Busan',
    'Incheon',
    'Daegu',
    'Daejeon',
    'Gwangju',
    'Suwon',
    'Ulsan',
    'Seongnam',
    'Goyang'
  ],
  IN: [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat'
  ],
  AU: [
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Gold Coast',
    'Newcastle',
    'Canberra',
    'Wollongong',
    'Logan City'
  ],
  CA: [
    'Toronto',
    'Montreal',
    'Vancouver',
    'Calgary',
    'Edmonton',
    'Ottawa',
    'Winnipeg',
    'Quebec City',
    'Hamilton',
    'Brampton'
  ]
}

export function getCitiesForCountry(countryCode: string): string[] {
  return citiesByCountry[countryCode] || []
}

// Get all countries for dropdown
export const getCountries = (): Country[] => {
  return countries.sort((a, b) => a.name.localeCompare(b.name))
}

// Get country by code
export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(c => c.code === code)
}

// Get contact sources
export const getContactSources = (): ContactSource[] => {
  return contactSources
}

// Search countries by name
export const searchCountries = (query: string): Country[] => {
  const lowerQuery = query.toLowerCase()
  return countries.filter(country =>
    country.name.toLowerCase().includes(lowerQuery) ||
    country.code.toLowerCase().includes(lowerQuery)
  ).sort((a, b) => a.name.localeCompare(b.name))
}