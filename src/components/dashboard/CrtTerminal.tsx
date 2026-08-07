import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'

const LINES = [
  'C:\\KRONOS> run session.c',
  '#include <stdio.h>',
  '#include <time.h>',
  '',
  'int main() {',
  '  time_t now = time(0);',
  '  struct tm *t;',
  '  t = localtime(&now);',
  '  printf("Focus: %02d:%02d",',
  '    t->tm_hour, t->tm_min);',
  '  return 0;',
  '}',
  '',
  'C:\\KRONOS> gcc session.c',
  'C:\\KRONOS> ./session.exe',
  'Focus mode: ON',
  '',
  'C:\\KRONOS> _',
]

const KW = ['int','struct','return','time_t','printf','localtime','main','include','void']

type Part = string | ReactElement

function colorize(line: string): ReactElement {
  if (!line) return <span>&nbsp;</span>
  if (line === 'C:\\KRONOS> _') {
    return (
      <span>
        <span style={{ color: '#66ffaa' }}>C:\KRONOS&gt; </span>
        <span style={{ display:'inline-block', width:5, height:9, background:'#33ff66', animation:'blink 0.9s step-end infinite', verticalAlign:'middle', boxShadow:'0 0 4px rgba(50,255,100,0.8)' }} />
      </span>
    )
  }
  if (line.startsWith('C:\\')) return <span style={{ color: '#66ffaa' }}>{line}</span>

  // Build parts array with keyword + string coloring
  let parts: Part[] = [line]

  KW.forEach(kw => {
    const next: Part[] = []
    parts.forEach(p => {
      if (typeof p !== 'string') { next.push(p); return }
      const reg = new RegExp(`(\\b${kw}\\b)`)
      const segs = p.split(reg)
      segs.forEach((s, i) => {
        if (s === kw) next.push(<span key={`${kw}${i}${s}`} style={{ color: '#55aaff' }}>{s}</span>)
        else if (s) next.push(s)
      })
    })
    parts = next
  })

  const final: Part[] = []
  parts.forEach(p => {
    if (typeof p !== 'string') { final.push(p); return }
    const segs = p.split(/(".*?")/)
    segs.forEach((s, i) => {
      if (s.startsWith('"')) final.push(<span key={`str${i}${s}`} style={{ color: '#ffaa44' }}>{s}</span>)
      else if (s) final.push(s)
    })
  })

  return <span>{final}</span>
}

export default function CrtTerminal() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const idxRef = useRef(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function next() {
      const line = LINES[idxRef.current % LINES.length]
      idxRef.current++
      setVisibleLines(prev => {
        const updated = [...prev, line]
        return updated.length > 10 ? updated.slice(-10) : updated
      })
      const delay = !line ? 280 : line.startsWith('C:\\') ? 900 : 220
      timer = setTimeout(next, delay)
    }
    timer = setTimeout(next, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      background:'#060e06', borderRadius:6,
      border:'3px solid #28303e', overflow:'hidden',
      fontFamily:'IBM Plex Mono', position:'relative',
    }}>
      <div style={{ height:5, background:'#222a38', position:'relative' }}>
        <div style={{ position:'absolute', top:1, left:'50%', transform:'translateX(-50%)', width:4, height:3, borderRadius:'50%', background:'#181e2a', border:'1px solid #2a3448' }} />
      </div>
      <div style={{ background:'#060e06', padding:'6px', minHeight:90, position:'relative', animation:'crtFlicker 9s linear infinite' }}>
        <div style={{ position:'relative', zIndex:2 }}>
          {visibleLines.map((line, i) => (
            <div key={i} style={{ fontSize:6, lineHeight:1.65, whiteSpace:'pre', color:'#33ff66', textShadow:'0 0 4px rgba(50,255,100,0.55)', display:'block' }}>
              {colorize(line)}
            </div>
          ))}
        </div>
        <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)', pointerEvents:'none', zIndex:3 }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.5))', pointerEvents:'none', zIndex:4 }} />
      </div>
      <div style={{ height:10, width:8, background:'#28303e', margin:'0 auto' }} />
      <div style={{ height:4, width:38, background:'#222a38', borderRadius:2, margin:'0 auto 2px' }} />
    </div>
  )
}
