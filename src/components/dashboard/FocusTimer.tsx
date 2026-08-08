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

  const total         = DURATIONS[mode]
  const pct           = 1 - seconds / total
  const color         = COLORS[mode]
  const mins          = Math.floor(seconds / 60)
  const secs          = seconds % 60
  const circumference = 2 * Math.PI * 56

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'0.8rem 0.9rem 0.6rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.65rem' }}>
        <span style={{ fontFamily:'IBM Plex Mono', fontSize:'0.62rem', color:'#2e2c3a', letterSpacing:'0.14em' }}>FOCUS TIMER</span>
        {sessions > 0 && (
          <span style={{ fontFamily:'IBM Plex Mono', fontSize:'0.6rem', color:'#3a3748' }}>
            {sessions}× today
          </span>
        )}
      </div>

      {/* Mode tabs */}
      <div style={{ display:'flex', gap:'0.3rem', marginBottom:'0.7rem', padding:'3px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid rgba(255,255,255,0.04)' }}>
        {(['work','short','long'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex:1, padding:'0.28rem 0', borderRadius:6, cursor:'pointer',
              background: mode === m ? `rgba(${m === 'work' ? '201,162,39' : m === 'short' ? '110,231,216' : '167,139,250'},0.12)` : 'transparent',
              border: `1px solid ${mode === m ? color + '50' : 'transparent'}`,
              color: mode === m ? color : '#3a3748',
              fontFamily:'Inter', fontSize:'0.62rem', fontWeight: mode === m ? 700 : 500,
              transition:'all 0.25s',
              letterSpacing: '0.02em',
            }}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      {/* SVG ring */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'relative' }}>
          {/* Outer glow when running */}
          {running && (
            <div style={{
              position:'absolute', inset:-8,
              borderRadius:'50%',
              background:`radial-gradient(ellipse, ${color}18 0%, transparent 70%)`,
              animation:'glowPulse 3s ease-in-out infinite',
            }} />
          )}
          <svg width={140} height={140} viewBox="0 0 140 140">
            {/* Background track */}
            <circle cx={70} cy={70} r={56} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={7} />
            {/* Subtle inner ring */}
            <circle cx={70} cy={70} r={46} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth={1} />
            {/* Progress arc */}
            <circle
              cx={70} cy={70} r={56}
              fill="none"
              stroke={color}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={`${circumference * pct} ${circumference}`}
              strokeDashoffset={0}
              transform="rotate(-90 70 70)"
              style={{
                transition:'stroke-dasharray 0.6s ease, stroke 0.6s ease',
                filter:`drop-shadow(0 0 8px ${color}90)`,
              }}
            />
            {/* Time */}
            <text x={70} y={65} textAnchor="middle" fill="#f0ece4" fontFamily="IBM Plex Mono" fontSize={24} fontWeight={500} letterSpacing={1}>
              {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
            </text>
            <text x={70} y={82} textAnchor="middle" fill={color} fontFamily="Inter" fontSize={8.5} fontWeight={700} letterSpacing={2.5} opacity={0.85}>
              {LABELS[mode].toUpperCase()}
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.75rem', alignItems:'center' }}>
          <button
            onClick={() => { setSeconds(DURATIONS[mode]); setRunning(false) }}
            style={{
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:7, color:'#4a4858', fontSize:'0.8rem',
              padding:'0.32rem 0.7rem', cursor:'pointer',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color='#9490a0'; e.currentTarget.style.borderColor='rgba(255,255,255,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.color='#4a4858'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' }}
          >↺</button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setRunning(r => !r)}
            style={{
              background: running
                ? 'rgba(248,113,113,0.1)'
                : `rgba(${mode === 'work' ? '201,162,39' : mode === 'short' ? '110,231,216' : '167,139,250'},0.12)`,
              border: `1px solid ${running ? 'rgba(248,113,113,0.5)' : color + '60'}`,
              borderRadius: 8, color: running ? '#f87171' : color,
              fontSize:'0.8rem', padding:'0.36rem 1.4rem',
              cursor:'pointer', fontFamily:'Space Grotesk', fontWeight:700,
              boxShadow: running
                ? '0 2px 16px rgba(248,113,113,0.15)'
                : `0 2px 16px ${color}25`,
              letterSpacing:'0.04em',
              transition:'all 0.25s',
            }}
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
