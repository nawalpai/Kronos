import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Period } from '../../lib/timezones'

export default function DashboardTopBar({
  cityName,
  region,
  period,
  time,
  suffix,
  date,
}: {
  cityName: string
  region: string
  period: Period
  time: string
  suffix: string
  date: string
}) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass flex items-center justify-between rounded-2xl px-5 py-3"
    >
      <Link to="/" className="focus-ring flex items-center gap-2 rounded-md">
        <span className="font-display text-base font-semibold tracking-tight text-paper">Kronos</span>
        <span className="hidden font-mono text-[10px] text-muted sm:inline">world time · study ambient</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-teal sm:inline">
          {period}
        </span>
        <div className="text-right">
          <div className="font-mono text-sm text-paper">
            {time}
            <span className="ml-1 text-[10px] text-muted">{suffix}</span>
          </div>
          <div className="font-mono text-[10px] text-muted">
            {cityName}, {region} · {date}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
