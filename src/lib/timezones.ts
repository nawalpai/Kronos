export interface CityZone {
  id: string
  city: string
  country: string
  iana: string
  offset: number // UTC offset in hours (approximate, for display)
  color: string
  emoji: string
}

export const CITY_LIBRARY: CityZone[] = [
  { id: 'nyc',  city: 'New York',      country: 'USA',          iana: 'America/New_York',    offset: -4,   color: '#f5a623', emoji: '🗽' },
  { id: 'lon',  city: 'London',        country: 'UK',           iana: 'Europe/London',       offset: 1,    color: '#4f8ef7', emoji: '🎡' },
  { id: 'tok',  city: 'Tokyo',         country: 'Japan',        iana: 'Asia/Tokyo',          offset: 9,    color: '#a78bfa', emoji: '🗼' },
  { id: 'syd',  city: 'Sydney',        country: 'Australia',    iana: 'Australia/Sydney',    offset: 10,   color: '#34d399', emoji: '🦘' },
  { id: 'par',  city: 'Paris',         country: 'France',       iana: 'Europe/Paris',        offset: 2,    color: '#38bdf8', emoji: '🗼' },
  { id: 'ber',  city: 'Berlin',        country: 'Germany',      iana: 'Europe/Berlin',       offset: 2,    color: '#60a5fa', emoji: '🐻' },
  { id: 'dxb',  city: 'Dubai',         country: 'UAE',          iana: 'Asia/Dubai',          offset: 4,    color: '#fbbf24', emoji: '🏙️' },
  { id: 'sin',  city: 'Singapore',     country: 'Singapore',    iana: 'Asia/Singapore',      offset: 8,    color: '#2dd4bf', emoji: '🦁' },
  { id: 'mum',  city: 'Mumbai',        country: 'India',        iana: 'Asia/Kolkata',        offset: 5.5,  color: '#fb7185', emoji: '🌊' },
  { id: 'seo',  city: 'Seoul',         country: 'South Korea',  iana: 'Asia/Seoul',          offset: 9,    color: '#c084fc', emoji: '🏯' },
  { id: 'mos',  city: 'Moscow',        country: 'Russia',       iana: 'Europe/Moscow',       offset: 3,    color: '#f87171', emoji: '🏛️' },
  { id: 'lax',  city: 'Los Angeles',   country: 'USA',          iana: 'America/Los_Angeles', offset: -7,   color: '#f97316', emoji: '🎬' },
  { id: 'sao',  city: 'São Paulo',     country: 'Brazil',       iana: 'America/Sao_Paulo',   offset: -3,   color: '#86efac', emoji: '🌿' },
  { id: 'ist',  city: 'Istanbul',      country: 'Turkey',       iana: 'Europe/Istanbul',     offset: 3,    color: '#fdba74', emoji: '🕌' },
  { id: 'tor',  city: 'Toronto',       country: 'Canada',       iana: 'America/Toronto',     offset: -4,   color: '#67e8f9', emoji: '🍁' },
  { id: 'hkg',  city: 'Hong Kong',     country: 'China',        iana: 'Asia/Hong_Kong',      offset: 8,    color: '#818cf8', emoji: '🏮' },
]

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night'

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5  && hour < 7)  return 'dawn'
  if (hour >= 7  && hour < 11) return 'morning'
  if (hour >= 11 && hour < 14) return 'noon'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}

export function getGreeting(hour: number): string {
  if (hour >= 5  && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  if (hour >= 17 && hour < 21) return 'Good Evening'
  return 'Good Night'
}

export function getLocalTime(iana: string): Date {
  // Use Intl to get the correct time in the target timezone
  const now = new Date()
  const str = now.toLocaleString('en-US', { timeZone: iana })
  return new Date(str)
}

export function formatTime(date: Date, use24h = false): string {
  if (use24h) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function offsetLabel(off: number): string {
  const sign = off >= 0 ? '+' : '-'
  const abs  = Math.abs(off)
  const h    = Math.floor(abs)
  const m    = Math.round((abs - h) * 60)
  return m > 0 ? `UTC${sign}${h}:${String(m).padStart(2, '0')}` : `UTC${sign}${h}`
}
