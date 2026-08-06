import { useEffect, useState } from 'react'

const CODE_LINES = [
  'const kronos = await Workspace.init()',
  'kronos.clock.sync("Asia/Tokyo")',
  '',
  'function focusSession(minutes) {',
  '  return new Timer(minutes * 60).start()',
  '}',
  '',
  '> compiling...',
  '> 0 errors, 0 warnings',
  '> session logged: 52m 14s',
  '',
  'while (true) {',
  '  plan()',
  '  focus()',
  '  review()',
  '}',
]

export default function CrtTerminal() {
  const [lines, setLines] = useState<string[]>([''])

  useEffect(() => {
    let lineIdx = 0
    let charIdx = 0
    let cancelled = false

    const tick = () => {
      if (cancelled) return
      const target = CODE_LINES[lineIdx % CODE_LINES.length]
      charIdx += 1
      setLines((prev) => {
        const next = [...prev]
        next[next.length - 1] = target.slice(0, charIdx)
        return next
      })
      if (charIdx >= target.length) {
        lineIdx += 1
        charIdx = 0
        setTimeout(() => {
          if (cancelled) return
          setLines((prev) => {
            const next = [...prev, '']
            return next.length > 9 ? next.slice(next.length - 9) : next
          })
        }, 220)
        setTimeout(tick, 420)
      } else {
        setTimeout(tick, 26 + Math.random() * 40)
      }
    }
    const start = setTimeout(tick, 500)
    return () => {
      cancelled = true
      clearTimeout(start)
    }
  }, [])

  return (
    <div className="h-full w-full overflow-hidden bg-[#04120a] px-2.5 py-2 font-mono text-[7px] leading-[1.5] text-[#7fffb0] sm:text-[8px]">
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre">
          {l}
          {i === lines.length - 1 && <span className="animate-pulse">▍</span>}
        </div>
      ))}
    </div>
  )
}
