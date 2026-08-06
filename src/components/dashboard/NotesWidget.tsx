import { useEffect, useState } from 'react'

export default function NotesWidget({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    setSaved(false)
    const id = setTimeout(() => setSaved(true), 600)
    return () => clearTimeout(id)
  }, [value])

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Quick notes</h3>
        <span className="font-mono text-[10px] text-muted">{saved ? 'saved' : 'saving…'}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Jot something down..."
        rows={4}
        className="focus-ring w-full resize-none rounded-lg border border-panel-line bg-white/[0.03] px-3 py-2 text-sm leading-relaxed text-paper placeholder:text-muted"
      />
    </div>
  )
}
