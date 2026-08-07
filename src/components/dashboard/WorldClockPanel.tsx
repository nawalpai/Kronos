import { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { useNow } from '../../lib/useNow'
import { CITY_LIBRARY, formatTime, formatDate, getTimeOfDay, getGreeting, offsetLabel } from '../../lib/timezones'
import type { CityZone } from '../../lib/timezones'

interface Props {
  cities: CityZone[]
  activeCity: CityZone
  onReorder: (cities: CityZone[]) => void
  onSetActive: (city: CityZone) => void
  onAdd: (city: CityZone) => void
  onRemove: (id: string) => void
  use24h: boolean
}

export default function WorldClockPanel({ cities, activeCity, onReorder, onSetActive, onAdd, onRemove, use24h }: Props) {
  const now = useNow()
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')

  const available = CITY_LIBRARY.filter(c =>
    !cities.find(x => x.id === c.id) &&
    (c.city.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
  )

  function getLocalDate(city: CityZone) {
    const str = now.toLocaleString('en-US', { timeZone: city.iana })
    return new Date(str)
  }

  const todLabels: Record<string, string> = {
    dawn: '🌅 Dawn', morning: '🌤 Morning', noon: '☀️ Noon',
    afternoon: '⛅ Afternoon', evening: '🌆 Evening', night: '🌙 Night',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.7rem', color: '#5a5668', letterSpacing: '0.12em' }}>
            WORLD CLOCKS
          </span>
          <button
            onClick={() => setShowAdd(v => !v)}
            style={{
              background: showAdd ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showAdd ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '6px', color: showAdd ? '#c9a227' : '#5a5668',
              fontSize: '0.75rem', padding: '0.25rem 0.6rem', cursor: 'pointer',
              fontFamily: 'Space Grotesk', transition: 'all 0.2s',
            }}
          >
            {showAdd ? '✕ Close' : '+ Add'}
          </button>
        </div>

        {/* Add city search */}
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search city…"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                color: '#f2f0e8', fontFamily: 'Inter', fontSize: '0.82rem',
                padding: '0.5rem 0.75rem', outline: 'none', marginBottom: '0.5rem',
              }}
            />
            <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
              {available.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onAdd(c); setSearch(''); }}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: '0.5rem',
                    padding: '0.4rem 0.5rem', background: 'none', border: 'none',
                    cursor: 'pointer', borderRadius: '6px', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,162,39,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <span style={{ fontSize: '0.85rem' }}>{c.emoji}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: '0.8rem', color: '#c8c4d4', flex: 1 }}>{c.city}</span>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.65rem', color: '#3a3748' }}>{offsetLabel(c.offset)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Clock cards — reorderable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' }}>
        <Reorder.Group axis="y" values={cities} onReorder={onReorder} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {cities.map(city => {
            const d = getLocalDate(city)
            const tod = getTimeOfDay(d.getHours())
            const isActive = city.id === activeCity.id

            return (
              <Reorder.Item key={city.id} value={city} style={{ listStyle: 'none' }}>
                <motion.div
                  whileHover={{ x: 2 }}
                  onClick={() => onSetActive(city)}
                  style={{
                    background: isActive ? 'rgba(201,162,39,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? 'rgba(201,162,39,0.25)' : 'rgba(255,255,255,0.05)'}`,
                    borderLeft: `3px solid ${isActive ? city.color : 'transparent'}`,
                    borderRadius: '8px', padding: '0.65rem 0.75rem',
                    cursor: 'pointer', position: 'relative',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  {/* Remove btn */}
                  {!isActive && (
                    <button
                      onClick={e => { e.stopPropagation(); onRemove(city.id) }}
                      style={{
                        position: 'absolute', top: '0.4rem', right: '0.5rem',
                        background: 'none', border: 'none', color: '#2a2830',
                        cursor: 'pointer', fontSize: '0.7rem', lineHeight: 1,
                        padding: '0.15rem 0.3rem', borderRadius: '4px',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#2a2830')}
                    >✕</button>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem', lineHeight: 1.2 }}>{city.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.82rem', color: '#f2f0e8' }}>
                          {city.city}
                        </span>
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.6rem', color: '#3a3748' }}>
                          {offsetLabel(city.offset)}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '1rem', fontWeight: 500, color: isActive ? city.color : '#c8c4d4', lineHeight: 1.3, marginTop: '0.1rem' }}>
                        {formatTime(d, use24h)}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#3a3748' }}>
                          {formatDate(d)}
                        </span>
                        <span style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: '#3a3748' }}>
                          {todLabels[tod]}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'Inter', fontSize: '0.65rem', color: city.color, opacity: 0.8, marginTop: '0.15rem' }}>
                        {getGreeting(d.getHours())}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
      </div>
    </div>
  )
}
