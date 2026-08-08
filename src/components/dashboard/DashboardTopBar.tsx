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

  const localStr  = now.toLocaleString('en-US', { timeZone: activeCity.iana })
  const localDate = new Date(localStr)
  const timeStr   = formatTime(localDate, use24h)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.5rem',
      height: 48,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(8,9,14,0.98)',
      backdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
      boxShadow: '0 1px 0 rgba(201,162,39,0.08), 0 4px 20px rgba(0,0,0,0.4)',
    }}>

      {/* Left: Logo */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0',
          opacity: 0.9, transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.9')}
      >
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: 'rgba(201,162,39,0.12)',
          border: '1px solid rgba(201,162,39,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem',
        }}>🕐</div>
        <span style={{
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.85rem',
          letterSpacing: '0.14em', color: '#c9a227',
        }}>
          KRONOS
        </span>
      </button>

      {/* Center: Active city pill + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(201,162,39,0.06)',
          border: '1px solid rgba(201,162,39,0.14)',
          borderRadius: '9999px',
          padding: '0.28rem 0.85rem',
          transition: 'border-color 0.2s, background 0.2s',
        }}>
          <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>{activeCity.emoji}</span>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.72rem', color: '#d4a832', letterSpacing: '0.04em' }}>
            {activeCity.city}
          </span>
          <span style={{ color: '#2e2c3a', fontSize: '0.65rem', fontFamily: 'IBM Plex Mono' }}>
            {offsetLabel(activeCity.offset)}
          </span>
        </div>

        <div style={{
          fontFamily: 'IBM Plex Mono', fontSize: '1.1rem', fontWeight: 500,
          color: '#f0ece4', letterSpacing: '0.06em',
          textShadow: '0 0 20px rgba(201,162,39,0.15)',
        }}>
          {timeStr}
        </div>
      </div>

      {/* Right: 24h toggle */}
      <button
        onClick={onToggle24h}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '6px',
          color: '#5a5668',
          fontFamily: 'IBM Plex Mono',
          fontSize: '0.68rem',
          padding: '0.28rem 0.65rem',
          cursor: 'pointer',
          letterSpacing: '0.06em',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(201,162,39,0.25)'
          e.currentTarget.style.color = '#c9a227'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.color = '#5a5668'
        }}
      >
        {use24h ? '24H' : '12H'}
      </button>
    </div>
  )
}
