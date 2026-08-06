import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

type Mode = 'work' | 'short' | 'long'

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const LABELS: Record<Mode, string> = {
  work: 'Focus',
  short: 'Short break',
  long: 'Long break',
}

export default function FocusTimer({ onSessionComplete }: { onSessionComplete: () => void }) {
  const [mode, setMode] = useState<Mode>('work')
  const [remaining, setRemaining] = useState(DURATIONS.work)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false)
            if (mode === 'work') onSessionComplete()
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode])

  const switchMode = (m: Mode) => {
    setMode(m)
    setRemaining(DURATIONS[m])
    setRunning(false)
  }

  const reset = () => {
    setRemaining(DURATIONS[mode])
    setRunning(false)
  }

  const total = DURATIONS[mode]
  const pct = 1 - remaining / total
  const r = 46
  const circumference = 2 * Math.PI * r
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-4 flex gap-1.5">
        {(['work', 'short', 'long'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`focus-ring rounded-lg px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
              mode === m ? 'bg-brass/15 text-brass-bright' : 'text-muted hover:text-paper'
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-5">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="56"
            cy="56"
            r={r}
            fill="none"
            stroke="#c9a227"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="flex-1">
          <div className="font-mono text-3xl tabular-nums text-paper">
            {mm}:{ss}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setRunning((v) => !v)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg bg-brass text-ink transition-transform hover:scale-105"
              aria-label={running ? 'Pause' : 'Start'}
            >
              {running ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              onClick={reset}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg border border-panel-line text-muted transition-colors hover:text-paper"
              aria-label="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
