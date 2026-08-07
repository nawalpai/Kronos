import { usePersistentState } from '../../lib/usePersistentState'

interface Stats { focusMinutes: number; tasksCompleted: number; streak: number }

export default function StatsRow() {
  const [stats] = usePersistentState<Stats>('kronos-stats', { focusMinutes: 0, tasksCompleted: 0, streak: 1 })

  const items = [
    { label:'Focus Time',   value: `${stats.focusMinutes}m`,     icon:'⏱', color:'#c9a227' },
    { label:'Completed',    value: `${stats.tasksCompleted}`,     icon:'✓',  color:'#6ee7d8' },
    { label:'Streak',       value: `${stats.streak}d`,            icon:'🔥', color:'#f97316' },
    { label:'Today',        value: new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}), icon:'📅', color:'#a78bfa' },
  ]

  return (
    <div style={{
      display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem',
      padding:'0.5rem 0.75rem 0.6rem',
      borderTop:'1px solid rgba(255,255,255,0.04)',
      flexShrink:0,
    }}>
      {items.map(item => (
        <div key={item.label} style={{
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)',
          borderRadius:8, padding:'0.5rem 0.6rem', textAlign:'center',
        }}>
          <div style={{ fontSize:'0.85rem', marginBottom:'0.15rem' }}>{item.icon}</div>
          <div style={{ fontFamily:'IBM Plex Mono', fontSize:'0.85rem', fontWeight:500, color:item.color, lineHeight:1 }}>
            {item.value}
          </div>
          <div style={{ fontFamily:'Inter', fontSize:'0.6rem', color:'#3a3748', marginTop:'0.2rem' }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
