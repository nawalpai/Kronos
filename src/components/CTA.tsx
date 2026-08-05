import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section id="get-started" className="relative px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="glass relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-16"
      >
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(201,162,39,0.14), transparent 70%)' }}
        />
        <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold tracking-tight text-paper sm:text-4xl">
          Your next hour is still unclaimed.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted">
          Set up Kronos in under a minute and let today's plan build itself.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="focus-ring rounded-xl bg-brass px-7 py-3 font-display text-sm font-semibold text-ink shadow-[0_0_30px_-8px_rgba(201,162,39,0.7)] transition-transform hover:scale-[1.03]"
          >
            Start free
          </a>
          <a
            href="#"
            className="focus-ring rounded-xl border border-panel-line px-7 py-3 font-display text-sm font-medium text-paper transition-colors hover:border-teal/50 hover:text-teal"
          >
            Book a walkthrough
          </a>
        </div>
      </motion.div>
    </section>
  )
}
