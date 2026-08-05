import { motion } from 'framer-motion'

const moments = [
  {
    time: '07:40',
    label: 'Plan',
    copy: 'Kronos reads yesterday\'s leftovers and today\'s deadlines, then drafts an order for the day. You adjust in seconds, not minutes.',
  },
  {
    time: '10:15',
    label: 'Focus',
    copy: 'One task, full screen, ambient sound, a timer that actually holds you to it. Everything else is muted until the block ends.',
  },
  {
    time: '13:30',
    label: 'Capture',
    copy: 'Lecture notes, meeting notes, half-formed ideas — typed or pasted in, organized into folders automatically as you go.',
  },
  {
    time: '19:00',
    label: 'Review',
    copy: 'A short readout: what got done, what slipped, and why — so tomorrow\'s plan starts smarter than today\'s did.',
  },
]

export default function DayTimeline() {
  return (
    <section id="timeline" className="relative px-4 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
            A day, start to finish
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
            The clock does the nagging.
            <br />
            You do the work.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[38px] hidden h-px bg-panel-line md:block" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-5">
            {moments.map((m, i) => (
              <motion.div
                key={m.time}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="mb-6 flex items-center gap-3 md:mb-8">
                  <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-brass ring-4 ring-ink" />
                  <span className="font-mono text-sm tabular-nums text-brass-bright">{m.time}</span>
                </div>
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-display text-lg font-medium text-paper">{m.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{m.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
