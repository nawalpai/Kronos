import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Coffee, BookOpen, Sprout, StickyNote } from 'lucide-react'
import { PERIOD_GRADIENT, type Period } from '../../lib/timezones'
import CrtTerminal from './CrtTerminal'

function Stars({ visible }: { visible: boolean }) {
  const stars = useRef(
    Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 55,
      size: Math.random() * 1.6 + 0.4,
      delay: Math.random() * 4,
    }))
  ).current
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-opacity duration-[1500ms]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute animate-pulse rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: '3.5s',
          }}
        />
      ))}
    </div>
  )
}

function Rain({ active }: { active: boolean }) {
  const drops = useRef(
    Array.from({ length: 70 }, () => ({
      x: Math.random() * 100,
      dur: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 2,
      len: 12 + Math.random() * 14,
    }))
  ).current
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {drops.map((d, i) => (
        <span
          key={i}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-teal/40 to-transparent"
          style={{
            left: `${d.x}%`,
            height: d.len,
            animation: `rainfall ${d.dur}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes rainfall {
          0% { transform: translateY(-10%); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default function DeskScene({
  period,
  rain,
}: {
  period: Period
  rain: boolean
}) {
  const grad = PERIOD_GRADIENT[period]
  const [flicker, setFlicker] = useState(1)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const id = setInterval(() => {
      setFlicker(Math.random() > 0.92 ? 0.85 : 1)
    }, 220)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const move = (e: PointerEvent) => {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Sky */}
      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${grad.top} 0%, ${grad.bottom} 65%, #0a0b10 100%)`,
          }}
        />
      </AnimatePresence>

      <Stars visible={period === 'night' || period === 'evening'} />
      <Rain active={rain} />

      {/* Sun / moon glow */}
      <motion.div
        animate={{ x: pointer.x * 8, y: pointer.y * 6 }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
        className="absolute left-1/2 top-[18%] h-40 w-40 -translate-x-1/2 rounded-full blur-2xl sm:h-56 sm:w-56"
        style={{ background: grad.glow }}
      />

      {/* Desk */}
      <motion.div
        animate={{ x: pointer.x * -6, y: pointer.y * -4 }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
        className="absolute inset-x-0 bottom-0 flex justify-center"
      >
        <div className="relative w-full max-w-2xl px-6 pb-6">
          {/* desk surface */}
          <div
            className="absolute inset-x-4 bottom-0 h-24 rounded-t-[2rem]"
            style={{ background: 'linear-gradient(180deg, #1c1712, #0d0a08)' }}
          />

          <div className="relative flex items-end justify-center gap-3 pb-16 sm:gap-6">
            {/* lamp */}
            <div className="relative mb-2 hidden flex-col items-center sm:flex">
              <motion.div
                animate={{ opacity: [0.7, 1, 0.75, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-4 w-8 rounded-full bg-brass-bright/70 blur-md"
              />
              <div className="h-3 w-10 rounded-t-full bg-brass/80" />
              <div className="h-10 w-0.5 bg-panel-line" />
              <div className="h-14 w-0.5 rotate-[20deg] bg-panel-line" />
            </div>

            {/* books + mug */}
            <div className="mb-1 flex flex-col items-center gap-1">
              <Coffee size={14} className="text-muted" />
              <div className="mt-1 flex gap-0.5">
                <div className="h-8 w-2 rounded-sm bg-teal/50" />
                <div className="h-6 w-2 rounded-sm bg-brass/50" />
                <div className="h-9 w-2 rounded-sm bg-rose-300/30" />
              </div>
            </div>

            {/* CRT monitor */}
            <div className="relative flex flex-col items-center">
              <div
                className="relative w-40 rounded-xl border border-[#3a352c] bg-gradient-to-b from-[#e9e4d8] to-[#c9c2b0] p-2.5 shadow-2xl sm:w-56"
                style={{ opacity: flicker }}
              >
                <div className="relative overflow-hidden rounded-md border border-black/40 bg-black">
                  <div className="h-24 sm:h-32">
                    <CrtTerminal />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)',
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]" />
                </div>
                <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-black/20" />
              </div>
              <div className="h-4 w-8 bg-[#c9c2b0]" />
              <div className="h-1.5 w-16 rounded-full bg-[#a89f8c]" />
            </div>

            {/* notebook + plant */}
            <div className="mb-1 flex flex-col items-center gap-1.5">
              <Sprout size={16} className="text-teal/70" />
              <StickyNote size={14} className="text-muted" />
            </div>

            {/* keyboard + mouse */}
            <div className="mb-1 hidden flex-col items-center gap-1 sm:flex">
              <BookOpen size={14} className="text-muted" />
              <div className="h-3 w-14 rounded-sm bg-[#1f1c17] ring-1 ring-black/30" />
              <div className="h-2 w-3 rounded-full bg-[#1f1c17] ring-1 ring-black/30" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
