import { useNavigate } from 'react-router-dom'
import { useNow } from '../../lib/useNow'
import { formatTime, offsetLabel } from '../../lib/timezones'
import type { CityZone } from '../../lib/timezones'

interface Props {
  activeCity: CityZone
  use24h: boolean
  onToggle24h: () => void
}

export default function DashboardTopBar({ activeCity, use24h, onToggle24h }: Props) {
  const navigate = useNavigate()
  const now = useNow()

  const localStr = now.toLocaleString('en-US', { timeZone: activeCity.iana })
  const localDate = new Date(localStr)
  const timeStr = formatTime(localDate, use24h)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 1.5rem',
      borderBottom: '1px solid rgba(201,162,39,0.1)',
      background: 'rgba(10,11,16,0.95)',
      backdropFilter: 'blur(12px)',
      position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
    }}>
      {/* Left: Logo */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🕐</span>
        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', color: '#c9a227' }}>
          KRONOS
        </span>
      </button>

      {/* Center: Active city + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          background: 'rgba(201,162,39,0.07)', border: '1px solid rgba(201,162,39,0.15)',
          borderRadius: '9999px', padding: '0.35rem 1rem',
        }}>
          <span style={{ fontSize: '0.9rem' }}>{activeCity.emoji}</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.75rem', color: '#c9a227', letterSpacing: '0.05em' }}>
            {activeCity.city}
          </span>
          <span style={{ color: '#3a3748', fontSize: '0.7rem', fontFamily: 'IBM Plex Mono' }}>
            {offsetLabel(activeCity.offset)}
          </span>
        </div>
        <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '1.05rem', fontWeight: 500, color: '#f2f0e8', letterSpacing: '0.05em' }}>
          {timeStr}
        </div>
      </div>

      {/* Right: Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={onToggle24h}
          style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px', color: '#9490a0', fontFamily: 'IBM Plex Mono',
            fontSize: '0.7rem', padding: '0.3rem 0.6rem', cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          {use24h ? '24H' : '12H'}
        </button>
      </div>
    </div>
  )
}
