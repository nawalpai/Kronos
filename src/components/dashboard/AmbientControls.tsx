import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  rainActive: boolean
  musicActive: boolean
  onToggleRain: () => void
  onToggleMusic: () => void
}

export default function AmbientControls({ rainActive, musicActive, onToggleRain, onToggleMusic }: Props) {
  const [open, setOpen] = useState(false)

  const controls = [
    { icon: '🌧', label:'Rain',  active: rainActive,  action: onToggleRain },
    { icon: '🎵', label:'Music', active: musicActive, action: onToggleMusic },
  ]

  return (
    <div style={{ position:'relative' }}>
      <motion.button
        whileHover={{ scale:1.05 }}
        whileTap={{ scale:0.95 }}
        onClick={() => setOpen(v => !v)}
        style={{
          width:34, height:34, borderRadius:'50%',
          background: open ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.04)',
          border:`1px solid ${open ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.08)'}`,
          color: open ? '#c9a227' : '#5a5668', fontSize:'0.9rem',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all 0.2s',
        }}
      >✦</motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:8, scale:0.95 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:8, scale:0.95 }}
            style={{
              position:'absolute', bottom:'calc(100% + 8px)', right:0,
              background:'rgba(12,13,20,0.95)', border:'1px solid rgba(201,162,39,0.12)',
              borderRadius:12, padding:'0.6rem', minWidth:130,
              backdropFilter:'blur(12px)',
              boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontFamily:'IBM Plex Mono', fontSize:'0.6rem', color:'#3a3748', letterSpacing:'0.1em', marginBottom:'0.5rem', padding:'0 0.25rem' }}>
              AMBIENT
            </div>
            {controls.map(c => (
              <button
                key={c.label}
                onClick={c.action}
                style={{
                  display:'flex', width:'100%', alignItems:'center', gap:'0.5rem',
                  padding:'0.4rem 0.5rem', borderRadius:8, cursor:'pointer',
                  background: c.active ? 'rgba(201,162,39,0.1)' : 'transparent',
                  border:`1px solid ${c.active ? 'rgba(201,162,39,0.2)' : 'transparent'}`,
                  transition:'all 0.15s', marginBottom:'0.25rem',
                }}
              >
                <span style={{ fontSize:'0.9rem' }}>{c.icon}</span>
                <span style={{ fontFamily:'Inter', fontSize:'0.75rem', color: c.active ? '#c9a227' : '#5a5668', fontWeight:500 }}>
                  {c.label}
                </span>
                <div style={{
                  marginLeft:'auto', width:8, height:8, borderRadius:'50%',
                  background: c.active ? '#c9a227' : '#1a1828',
                  border:'1px solid rgba(255,255,255,0.1)',
                  boxShadow: c.active ? '0 0 6px rgba(201,162,39,0.6)' : 'none',
                  transition:'all 0.2s',
                }} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
