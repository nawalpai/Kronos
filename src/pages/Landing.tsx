import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import KronosOrb from '../components/KronosOrb'
import ParticleField from '../components/ParticleField'

function RippleButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    const rect = btnRef.current!.getBoundingClientRect()
    const id = Date.now()
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 700)
    onClick()
  }

  return (
    <motion.button
      ref={btnRef}
      onClick={handleClick}
      whileHover={{ y: -4, boxShadow: '0 0 40px rgba(201,162,39,0.6), 0 0 80px rgba(201,162,39,0.3)' }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #c9a227, #e8c05c, #a07c1a)',
        color: '#0a0b10', fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em',
        padding: '0.875rem 2.5rem', borderRadius: '9999px', border: 'none',
        cursor: 'pointer', boxShadow: '0 0 24px rgba(201,162,39,0.35)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {ripples.map(r => (
        <span key={r.id} style={{
          position: 'absolute', borderRadius: '50%',
          width: '10px', height: '10px',
          left: r.x - 5, top: r.y - 5,
          background: 'rgba(255,255,255,0.5)',
          animation: 'ripple 0.7s ease-out forwards',
          pointerEvents: 'none',
        }} />
      ))}
      {children}
    </motion.button>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)

  const goToApp = () => {
    setTransitioning(true)
    setTimeout(() => navigate('/app'), 800)
  }

  return (
    <>
      <ParticleField />

      {/* Cinematic transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            style={{
              position: 'fixed', inset: 0, background: '#0a0b10',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🕐</div>
              <div style={{ fontFamily: 'Space Grotesk', color: '#c9a227', fontSize: '1.25rem', letterSpacing: '0.2em' }}>
                ENTERING KRONOS
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* NAV */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.5rem 3rem', borderBottom: '1px solid rgba(201,162,39,0.08)',
            backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(10,11,16,0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🕐</span>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.08em', color: '#f2f0e8' }}>
              KRONOS
            </span>
          </div>

          <RippleButton onClick={goToApp}>Start</RippleButton>
        </motion.nav>

        {/* HERO */}
        <section style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '4rem 2rem', gap: '4rem', flexWrap: 'wrap',
          position: 'relative',
        }}>

          {/* Aurora background */}
          <div style={{
            position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
            zIndex: 0,
          }}>
            <div style={{
              position: 'absolute', top: '10%', left: '-20%',
              width: '70%', height: '50%',
              background: 'radial-gradient(ellipse, rgba(201,162,39,0.07) 0%, transparent 70%)',
              animation: 'aurora 12s ease-in-out infinite',
              borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute', bottom: '10%', right: '-10%',
              width: '50%', height: '40%',
              background: 'radial-gradient(ellipse, rgba(110,231,216,0.06) 0%, transparent 70%)',
              animation: 'aurora 16s ease-in-out infinite reverse',
              borderRadius: '50%',
            }} />
          </div>

          {/* Text side */}
          <div style={{ flex: '1', minWidth: '320px', maxWidth: '560px', position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div style={{
                display: 'inline-block',
                border: '1px solid rgba(201,162,39,0.3)',
                borderRadius: '9999px',
                padding: '0.35rem 1rem',
                marginBottom: '1.5rem',
                background: 'rgba(201,162,39,0.07)',
              }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.72rem', color: '#c9a227', letterSpacing: '0.12em' }}>
                  WORLD TIME · STUDY AMBIENT
                </span>
              </div>

              <h1 style={{
                fontFamily: 'Space Grotesk', fontWeight: 700,
                fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                lineHeight: 1.05, marginBottom: '1rem',
                color: '#f2f0e8',
              }}>
                Time,{' '}
                <span className="gold-text" style={{
                  fontFamily: 'Fraunces', fontStyle: 'italic', fontWeight: 500,
                }}>
                  orchestrated
                </span>
              </h1>

              <p style={{
                fontSize: '1.15rem', color: '#9490a0', lineHeight: 1.7,
                marginBottom: '2.5rem', maxWidth: '440px',
              }}>
                A living workspace where world clocks, focus timers, and ambient
                environments converge — designed for deep work and clear thinking.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <RippleButton onClick={goToApp}>Start</RippleButton>
                <button
                  onClick={goToApp}
                  style={{
                    background: 'transparent', border: '1px solid rgba(201,162,39,0.3)',
                    color: '#c9a227', fontFamily: 'Space Grotesk', fontWeight: 600,
                    fontSize: '0.95rem', padding: '0.875rem 2rem',
                    borderRadius: '9999px', cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLElement).style.background = 'rgba(201,162,39,0.1)'
                    ;(e.target as HTMLElement).style.borderColor = '#c9a227'
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLElement).style.background = 'transparent'
                    ;(e.target as HTMLElement).style.borderColor = 'rgba(201,162,39,0.3)'
                  }}
                >
                  Start your first session →
                </button>
              </div>

              {/* Feature pills */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                {['🌍 World Clocks', '🌅 Day/Night Sky', '⏱ Pomodoro', '📝 Notes', '🌧 Ambient Rain'].map(f => (
                  <span key={f} style={{
                    fontFamily: 'IBM Plex Mono', fontSize: '0.72rem', color: '#5a5668',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px', padding: '0.35rem 0.75rem',
                    background: 'rgba(255,255,255,0.02)',
                  }}>{f}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Orb side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              width: 'clamp(300px, 40vw, 520px)',
              height: 'clamp(300px, 40vw, 520px)',
              position: 'relative', zIndex: 1,
            }}
          >
            {/* Glow rings behind orb */}
            <div style={{
              position: 'absolute', inset: '-20%',
              background: 'radial-gradient(ellipse, rgba(201,162,39,0.1) 0%, transparent 65%)',
              animation: 'pulse-glow 4s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            <KronosOrb />
          </motion.div>
        </section>

        {/* FEATURES STRIP */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            padding: '5rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(18,19,26,0.6)', backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', fontWeight: 700, color: '#f2f0e8', marginBottom: '0.75rem' }}>
              Your workspace, in sync with the world
            </h2>
            <p style={{ color: '#5a5668', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
              Every timezone. Every focus session. Every note. Beautifully unified.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {[
              { icon: '🌍', title: 'Live World Clocks', desc: 'Track multiple cities with beautiful day/night awareness and timezone switching.' },
              { icon: '🌅', title: 'Dynamic Sky Scene', desc: 'The desk scene shifts from dawn to dusk based on your active timezone.' },
              { icon: '⏱', title: 'Pomodoro Timer', desc: 'Circular focus timer with work, short break, and long break modes.' },
              { icon: '📝', title: 'Notes & Tasks', desc: 'Autosaving notes and a drag-to-reorder task list, persisted locally.' },
              { icon: '🌧', title: 'Ambient Sounds', desc: 'Rain, wind, and procedural music that shifts with the time of day.' },
              { icon: '📊', title: 'Daily Stats', desc: 'Focus time, completed tasks, and your current productivity streak.' },
            ].map(f => (
              <motion.div
                key={f.title}
                whileHover={{ y: -6, borderColor: 'rgba(201,162,39,0.3)' }}
                style={{
                  background: 'rgba(12,13,20,0.7)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px', padding: '1.75rem',
                  transition: 'border-color 0.25s ease',
                }}
              >
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: '#f2f0e8', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{f.title}</div>
                <div style={{ color: '#5a5668', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FOOTER CTA */}
        <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,162,39,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: 'Fraunces', fontStyle: 'italic', fontSize: '2.5rem', color: '#f2f0e8', marginBottom: '1rem' }}>
              Ready to begin?
            </h2>
            <p style={{ color: '#5a5668', marginBottom: '2.5rem' }}>Enter your workspace. Time awaits.</p>
            <RippleButton onClick={goToApp}>Open Kronos →</RippleButton>
          </motion.div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '2rem 3rem', borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: '#2a2830', fontSize: '0.8rem', fontFamily: 'IBM Plex Mono',
        }}>
          <span>KRONOS © 2025</span>
          <span>Nawal Kishore Satish Pai</span>
        </footer>
      </div>
    </>
  )
}
