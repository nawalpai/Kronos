import { useState, useEffect } from 'react'
import { usePersistentState } from '../../lib/usePersistentState'

export default function NotesWidget() {
  const [notes, setNotes] = usePersistentState('kronos-notes', '')
  const [saved, setSaved] = useState(false)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (v: string) => {
    setNotes(v)
    setSaved(false)
    if (timer) clearTimeout(timer)
    setTimer(setTimeout(() => setSaved(true), 1200))
  }

  useEffect(() => () => { if (timer) clearTimeout(timer) }, [timer])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'0.75rem 0.75rem 0.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
        <span style={{ fontFamily:'IBM Plex Mono', fontSize:'0.68rem', color:'#3a3748', letterSpacing:'0.12em' }}>NOTES</span>
        <span style={{ fontFamily:'IBM Plex Mono', fontSize:'0.6rem', color: saved ? '#6ee7d8' : '#2a2830', transition:'color 0.4s' }}>
          {saved ? '● Saved' : notes.length > 0 ? '○ Unsaved' : ''}
        </span>
      </div>
      <textarea
        value={notes}
        onChange={e => handleChange(e.target.value)}
        placeholder="Quick notes, ideas, thoughts…"
        style={{
          flex:1, resize:'none', background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(255,255,255,0.06)', borderRadius:8,
          color:'#c8c4d4', fontFamily:'Inter', fontSize:'0.8rem',
          lineHeight:1.65, padding:'0.6rem 0.65rem', outline:'none',
          transition:'border-color 0.2s',
        }}
        onFocus={e => (e.target.style.borderColor = 'rgba(201,162,39,0.2)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.06)')}
      />
      <div style={{ fontFamily:'IBM Plex Mono', fontSize:'0.6rem', color:'#2a2830', marginTop:'0.3rem', textAlign:'right' }}>
        {notes.length} chars
      </div>
    </div>
  )
}
