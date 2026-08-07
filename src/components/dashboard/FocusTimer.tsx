import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type Mode = 'work' | 'short' | 'long'

const DURATIONS: Record<Mode, number> = { work: 25 * 60, short: 5 * 60, long: 15 * 60 }
const LABELS: Record<Mode, string> = { work: 'Focus', short: 'Short Break', long: 'Long Break' }
const COLORS: Record<Mode, string> = { work: '#c9a227', short: '#6ee7d8', long: '#a78bfa' }

export default function FocusTimer() {
  const [mode, setMode] = useState<Mode>('work')
  const [seconds, setSeconds] = useState(DURATIONS['work'])
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSeconds(DURATIONS[mode])
    setRunning(false)
  }, [mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setRunning(false)
            setSessions(n => n + 1)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const total   = DURATIONS[mode]
  const pct     = 1 - seconds / total
  const color   = COLORS[mode]
  const mins    = Math.floor(seconds / 60)
  const secs    = seconds % 60

  const r  = 54
  const cx = 68
  const circumference = 2 * Math.PI * r
  const dash = circumference * pct

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'0.75rem 0.75rem 0.5rem' }}>
      <span style={{ fontFamily:'IBM Plex Mono', fontSize:'0.68rem', color:'#3a3748', letterSpacing:'0.12em', marginBottom:'0.6rem' }}>FOCUS TIMER</span>

      {/* Mode tabs */}
      <div style={{ display:'flex', gap:'0.35rem', marginBottom:'0.75rem' }}>
        {(['work','short','long'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex:1, padding:'0.3rem 0', borderRadius:6, cursor:'pointer',
              background: mode === m ? `rgba(${m === 'work' ? '201,162,39' : m === 'short' ? '110,231,216' : '167,139,250'},0.15)` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${mode === m ? color : 'rgba(255,255,255,0.06)'}`,
              color: mode === m ? color : '#3a3748',
              fontFamily:'Inter', fontSize:'0.65rem', fontWeight:600,
              transition:'all 0.2s',
            }}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      {/* SVG ring */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <svg width={136} height={136} viewBox="0 0 136 136">
          {/* Track */}
          <circle cx={cx} cy={68} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
          {/* Progress */}
          <circle
            cx={cx} cy={68} r={r}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            strokeDashoffset={0}
            transform="rotate(-90 68 68)"
            style={{ transition:'stroke-dasharray 0.5s ease, stroke 0.5s ease', filter:`drop-shadow(0 0 6px ${color}80)` }}
          />
          {/* Time text */}
          <text x={cx} y={62} textAnchor="middle" fill="#f2f0e8" fontFamily="IBM Plex Mono" fontSize={22} fontWeight={500}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </text>
          <text x={cx} y={80} textAnchor="middle" fill={color} fontFamily="Inter" fontSize={9} fontWeight={600} letterSpacing={2}>
            {LABELS[mode].toUpperCase()}
          </text>
        </svg>

        {/* Controls */}
        <div style={{ display:'flex', gap:'0.6rem', marginTop:'0.6rem', alignItems:'center' }}>
          <button
            onClick={() => { setSeconds(DURATIONS[mode]); setRunning(false) }}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, color:'#5a5668', fontSize:'0.75rem', padding:'0.3rem 0.65rem', cursor:'pointer', fontFamily:'Inter' }}
          >↺</button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setRunning(r => !r)}
            style={{
              background: running ? 'rgba(248,113,113,0.15)' : `rgba(${mode === 'work' ? '201,162,39' : mode === 'short' ? '110,231,216' : '167,139,250'},0.15)`,
              border: `1px solid ${running ? '#f87171' : color}`,
              borderRadius: 8, color: running ? '#f87171' : color,
              fontSize:'0.82rem', padding:'0.4rem 1.2rem',
              cursor:'pointer', fontFamily:'Space Grotesk', fontWeight:600,
              boxShadow: running ? '0 0 12px rgba(248,113,113,0.2)' : `0 0 12px ${color}30`,
              transition:'all 0.2s',
            }}
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </motion.button>
        </div>

        {sessions > 0 && (
          <div style={{ marginTop:'0.5rem', fontFamily:'IBM Plex Mono', fontSize:'0.65rem', color:'#3a3748' }}>
            {sessions} session{sessions > 1 ? 's' : ''} completed today
          </div>
        )}
      </div>
    </div>
  )
}
