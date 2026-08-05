import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import KronosOrb from './KronosOrb'

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const ss = String(time.getSeconds()).padStart(2, '0')
  return (
    <span className="font-mono text-xs tabular-nums text-muted">
      {hh}:{mm}:{ss} — your local time
    </span>
  )
}

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-4 pt-24 sm:pt-28">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          className="relative z-10"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-panel-line px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            <LiveClock />
          </div>

          <h1 className="font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-paper sm:text-6xl lg:text-[4rem]">
            Every hour,
            <br />
            <span className="text-gradient-brass">accounted for.</span>
          </h1>

          <p className="font-epigraph mt-5 max-w-md text-lg italic text-muted">
            "Kronos does not create time — he keeps it from being wasted."
          </p>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-muted">
            Kronos is where students, professionals, and developers plan the
            day, take the notes, and run the focus sessions that actually
            move the work forward — one workspace, built around the clock
            instead of around a feed.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              id="get-started"
              href="#get-started"
              className="focus-ring rounded-xl bg-brass px-6 py-3 font-display text-sm font-semibold text-ink shadow-[0_0_30px_-8px_rgba(201,162,39,0.7)] transition-transform hover:scale-[1.03]"
            >
              Start your first session
            </a>
            <a
              href="#product"
              className="focus-ring rounded-xl border border-panel-line px-6 py-3 font-display text-sm font-medium text-paper transition-colors hover:border-teal/50 hover:text-teal"
            >
              See how it works
            </a>
          </div>

          <p className="mt-5 font-mono text-xs text-muted">
            No credit card. 2-minute setup. Cancel anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
          className="relative mx-auto aspect-square w-full max-w-[520px]"
        >
          <div
            className="absolute inset-0 -z-10 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.18), transparent 65%)' }}
          />
          <KronosOrb />
        </motion.div>
      </div>
    </section>
  )
}
