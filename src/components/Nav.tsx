import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav className="glass flex w-full max-w-5xl items-center justify-between rounded-2xl px-5 py-3">
        <a href="#top" className="focus-ring flex items-center gap-2 rounded-md">
          <span className="font-display text-lg font-semibold tracking-tight text-paper">
            Kronos
          </span>
          <span className="hidden font-mono text-[11px] text-muted sm:inline">v1.0</span>
        </a>

        <Link
          to="/app"
          className="focus-ring rounded-lg bg-paper px-4 py-2 font-display text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
        >
          Start
        </Link>
      </nav>
    </motion.header>
  )
}
