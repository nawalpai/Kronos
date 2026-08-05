import { motion } from 'framer-motion'

const stats = [
  { value: '52 min', label: 'average focus session length' },
  { value: '4.2×', label: 'more tasks finished within due dates' },
  { value: '18 sec', label: 'to turn a goal into a plan' },
  { value: '30 s', label: 'genuine setup time, start to finish' },
]

export default function Stats() {
  return (
    <section className="relative px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="glass grid grid-cols-2 gap-8 rounded-2xl px-6 py-10 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center sm:text-left"
            >
              <div className="font-display text-3xl font-semibold text-brass-bright sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-xs leading-snug text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
