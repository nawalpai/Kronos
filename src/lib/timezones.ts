export type Period = 'morning' | 'afternoon' | 'evening' | 'night'

export interface CityDef {
  id: string
  name: string
  region: string
  tz: string
  flag: string
}

export const CITY_LIBRARY: CityDef[] = [
  { id: 'tokyo', name: 'Tokyo', region: 'Japan', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'new-york', name: 'New York', region: 'USA', tz: 'America/New_York', flag: '🇺🇸' },
  { id: 'london', name: 'London', region: 'UK', tz: 'Europe/London', flag: '🇬🇧' },
  { id: 'dubai', name: 'Dubai', region: 'UAE', tz: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'mumbai', name: 'Mumbai', region: 'India', tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'paris', name: 'Paris', region: 'France', tz: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'sydney', name: 'Sydney', region: 'Australia', tz: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'singapore', name: 'Singapore', region: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'berlin', name: 'Berlin', region: 'Germany', tz: 'Europe/Berlin', flag: '🇩🇪' },
  { id: 'los-angeles', name: 'Los Angeles', region: 'USA', tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'sao-paulo', name: 'São Paulo', region: 'Brazil', tz: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'moscow', name: 'Moscow', region: 'Russia', tz: 'Europe/Moscow', flag: '🇷🇺' },
]

export function cityLocalDate(tz: string, now: Date): Date {
  // Build a Date object that reflects the wall-clock time in `tz`.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(now)

  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value

  return new Date(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) === 24 ? 0 : Number(map.hour),
    Number(map.minute),
    Number(map.second)
  )
}

export function periodOf(hour: number): Period {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

export function formatTime(d: Date, format: '12h' | '24h'): { time: string; suffix: string } {
  if (format === '24h') {
    return {
      time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
      suffix: '',
    }
  }
  const h = d.getHours()
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return { time: `${String(h12).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`, suffix }
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function utcOffsetLabel(tz: string, now: Date): string {
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
  const part = dtf.formatToParts(now).find((p) => p.type === 'timeZoneName')
  return part?.value.replace('GMT', 'UTC') ?? ''
}

export const PERIOD_GRADIENT: Record<Period, { top: string; bottom: string; glow: string; label: string }> = {
  morning: {
    top: '#2c2440',
    bottom: '#8a4a2c',
    glow: 'rgba(255,176,110,0.35)',
    label: 'Sunrise',
  },
  afternoon: {
    top: '#1a3350',
    bottom: '#3f7fb0',
    glow: 'rgba(120,190,255,0.3)',
    label: 'Daylight',
  },
  evening: {
    top: '#241634',
    bottom: '#7a3550',
    glow: 'rgba(255,130,110,0.32)',
    label: 'Sunset',
  },
  night: {
    top: '#05060c',
    bottom: '#0d1330',
    glow: 'rgba(110,150,255,0.18)',
    label: 'Moonlight',
  },
}
