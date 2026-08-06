import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, X, CloudRain, Music, Wind, Keyboard } from 'lucide-react'

export interface AmbientState {
  rain: boolean
  music: boolean
  wind: boolean
  keySounds: boolean
  clockFormat: '12h' | '24h'
  particleDensity: 'low' | 'medium' | 'high'
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`focus-ring relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-brass' : 'bg-white/10'}`}
      role="switch"
      aria-checked={on}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 h-4 w-4 rounded-full bg-paper"
        style={{ left: on ? 18 : 2 }}
      />
    </button>
  )
}

export default function AmbientControls({
  state,
  setState,
}: {
  state: AmbientState
  setState: (s: AmbientState) => void
}) {
  const [open, setOpen] = useState(false)
  const patch = (p: Partial<AmbientState>) => setState({ ...state, ...p })

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass mb-3 w-64 rounded-2xl p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Ambient</h3>
              <button onClick={() => setOpen(false)} className="focus-ring text-muted hover:text-paper">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-paper">
                  <CloudRain size={14} className="text-muted" /> Rain
                </span>
                <Toggle on={state.rain} onClick={() => patch({ rain: !state.rain })} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-paper">
                  <Music size={14} className="text-muted" /> Ambient music
                </span>
                <Toggle on={state.music} onClick={() => patch({ music: !state.music })} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-paper">
                  <Wind size={14} className="text-muted" /> Wind
                </span>
                <Toggle on={state.wind} onClick={() => patch({ wind: !state.wind })} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-paper">
                  <Keyboard size={14} className="text-muted" /> Key sounds
                </span>
                <Toggle on={state.keySounds} onClick={() => patch({ keySounds: !state.keySounds })} />
              </div>

              <div className="border-t border-panel-line pt-3">
                <div className="mb-1.5 flex items-center justify-between text-sm text-paper">
                  <span>Clock format</span>
                  <div className="flex gap-1">
                    {(['12h', '24h'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => patch({ clockFormat: f })}
                        className={`focus-ring rounded-md px-2 py-0.5 font-mono text-[10px] ${
                          state.clockFormat === f ? 'bg-brass/20 text-brass-bright' : 'text-muted hover:text-paper'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm text-paper">
                  <span>Particle density</span>
                  <div className="flex gap-1">
                    {(['low', 'medium', 'high'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => patch({ particleDensity: d })}
                        className={`focus-ring rounded-md px-2 py-0.5 font-mono text-[10px] ${
                          state.particleDensity === d
                            ? 'bg-brass/20 text-brass-bright'
                            : 'text-muted hover:text-paper'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {state.music && (
                <p className="pt-1 text-[10px] leading-snug text-muted">
                  Ambient audio isn't wired up yet — this toggle is ready for when a sound source is added.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="focus-ring glass flex h-11 w-11 items-center justify-center rounded-full text-paper transition-transform hover:scale-105"
        aria-label="Ambient controls"
      >
        <Settings size={17} />
      </button>
    </div>
  )
}
