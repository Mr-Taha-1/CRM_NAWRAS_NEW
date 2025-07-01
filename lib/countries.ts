export interface Country {
  name: string
  code: string
  flag: string
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