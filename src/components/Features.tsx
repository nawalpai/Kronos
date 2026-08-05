import { motion } from 'framer-motion'
import {
  ListChecks,
  NotebookPen,
  Timer,
  Sparkles,
  CalendarDays,
  BarChart3,
  Focus,
  Trophy,
} from 'lucide-react'

const features = [
  {
    icon: ListChecks,
    title: 'Task manager',
    copy: 'Drag-and-drop boards, priority levels, due dates, and reminders that fire before you need them, not after.',
  },
  {
    icon: NotebookPen,
    title: 'Notes',
    copy: 'Markdown, folders, pinning, and instant search across everything you\'ve ever written down.',
  },
  {
    icon: Timer,
    title: 'Study dashboard',
    copy: 'Daily, weekly, and monthly goals with a Pomodoro timer and a streak that doesn\'t let you off easy.',
  },
  {
    icon: Sparkles,
    title: 'AI assistant',
    copy: 'Turns a vague goal into a scheduled plan, summarizes long notes, and re-prioritizes when things shift.',
  },
  {
    icon: CalendarDays,
    title: 'Calendar',
    copy: 'Tasks, deadlines, and study blocks on one timeline — not three apps you have to keep in sync yourself.',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    copy: 'Study hours, completion rates, and weekly reports that show the trend, not just the day.',
  },
  {
    icon: Focus,
    title: 'Focus mode',
    copy: 'Fullscreen, ambient sound, and a minimal UI that gets out of the way until the session ends.',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    copy: 'XP, levels, and streak rewards for the days you show up — with no leaderboard forcing a comparison.',
  },
]

export default function Features() {
  return (
    <section id="product" className="relative px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
            Inside the workspace
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
            Eight tools. One rhythm.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass group rounded-2xl p-5 transition-colors hover:border-brass/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brass-bright transition-colors group-hover:bg-brass/10">
                <f.icon size={18} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-base font-medium text-paper">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
