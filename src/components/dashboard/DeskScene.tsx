import { useEffect, useRef, useCallback } from 'react'
import { useNow } from '../../lib/useNow'
import { getTimeOfDay } from '../../lib/timezones'
import type { CityZone } from '../../lib/timezones'
import CrtTerminal from './CrtTerminal'

interface SkyConfig {
  sky: string; skyBottom: string; wallBg: string
  showSun: boolean; showMoon: boolean; showStars: boolean
  lampOpacity: number
  fogColor: string
  ambientGlow: string
  horizonGlow: string
}

function getSkyConfig(tod: ReturnType<typeof getTimeOfDay>): SkyConfig {
  switch (tod) {
    case 'dawn':      return { sky:'#150820', skyBottom:'#c85a28', wallBg:'#0e0810', showSun:false, showMoon:true,  showStars:true,  lampOpacity:0.5,  fogColor:'rgba(180,80,40,0.06)',   ambientGlow:'rgba(200,90,40,0.08)',   horizonGlow:'rgba(230,100,40,0.15)' }
    case 'morning':   return { sky:'#1060a0', skyBottom:'#90d0f8', wallBg:'#141418', showSun:true,  showMoon:false, showStars:false, lampOpacity:0,    fogColor:'rgba(100,180,240,0.04)', ambientGlow:'rgba(80,160,220,0.06)',  horizonGlow:'rgba(140,210,255,0.12)' }
    case 'noon':      return { sky:'#0850a0', skyBottom:'#50b8f0', wallBg:'#141420', showSun:true,  showMoon:false, showStars:false, lampOpacity:0,    fogColor:'rgba(80,160,240,0.04)',  ambientGlow:'rgba(60,140,220,0.05)',  horizonGlow:'rgba(100,190,255,0.1)' }
    case 'afternoon': return { sky:'#1050a0', skyBottom:'#70c0f0', wallBg:'#131318', showSun:true,  showMoon:false, showStars:false, lampOpacity:0,    fogColor:'rgba(90,160,230,0.04)',  ambientGlow:'rgba(70,140,210,0.05)',  horizonGlow:'rgba(120,190,255,0.1)' }
    case 'evening':   return { sky:'#080810', skyBottom:'#c05010', wallBg:'#0c0804', showSun:false, showMoon:false, showStars:false, lampOpacity:0.8,  fogColor:'rgba(180,60,10,0.07)',   ambientGlow:'rgba(200,80,20,0.09)',   horizonGlow:'rgba(220,90,20,0.18)' }
    default:          return { sky:'#030508', skyBottom:'#030508', wallBg:'#090a12', showSun:false, showMoon:true,  showStars:true,  lampOpacity:1,    fogColor:'rgba(30,40,80,0.06)',    ambientGlow:'rgba(20,30,70,0.08)',    horizonGlow:'rgba(40,60,120,0.08)' }
  }
}

interface Props { activeCity: CityZone; rainActive: boolean }

export default function DeskScene({ activeCity, rainActive }: Props) {
  const now = useNow()
  const rainCanvas = useRef<HTMLCanvasElement>(null)
  const dustCanvas = useRef<HTMLCanvasElement>(null)
  const rainAnim   = useRef<number>(0)
  const dustAnim   = useRef<number>(0)
  const mouseRef   = useRef({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

  const localStr  = now.toLocaleString('en-US', { timeZone: activeCity.iana })
  const localDate = new Date(localStr)
  const tod       = getTimeOfDay(localDate.getHours())
  const sky       = getSkyConfig(tod)

  // Mouse parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    }
  }, [])

  // Dust/mote particles canvas
  useEffect(() => {
    const canvas = dustCanvas.current
    if (!canvas) return
    const parent = canvas.parentElement!
    canvas.width  = parent.clientWidth
    canvas.height = parent.clientHeight
    const ctx = canvas.getContext('2d')!

    type Mote = { x:number; y:number; vx:number; vy:number; size:number; op:number; baseOp:number; phase:number }
    const motes: Mote[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.7,
      vx: (Math.random() - 0.48) * 0.18,
      vy: -Math.random() * 0.12 - 0.04,
      size: Math.random() * 1.2 + 0.3,
      op: 0,
      baseOp: Math.random() * 0.35 + 0.08,
      phase: Math.random() * Math.PI * 2,
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 0.008
      motes.forEach(m => {
        m.phase += 0.005
        m.x += m.vx + Math.sin(m.phase * 0.7) * 0.06
        m.y += m.vy
        m.op = m.baseOp * (0.5 + 0.5 * Math.sin(t + m.phase))
        if (m.y < -10 || m.x < -10 || m.x > canvas.width + 10) {
          m.x = Math.random() * canvas.width
          m.y = canvas.height * 0.65
        }
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,162,39,${m.op})`
        ctx.fill()
      })
      dustAnim.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(dustAnim.current)
  }, [])

  // Rain canvas
  useEffect(() => {
    const canvas = rainCanvas.current
    if (!canvas) return
    const parent = canvas.parentElement!
    canvas.width  = parent.clientWidth
    canvas.height = parent.clientHeight
    const ctx = canvas.getContext('2d')!

    type Drop = { x:number; y:number; len:number; speed:number; op:number }
    const spawn = (): Drop => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -100,
      len: 10 + Math.random() * 14,
      speed: 10 + Math.random() * 7,
      op: 0.12 + Math.random() * 0.3,
    })

    let drops: Drop[] = []
    if (rainActive) {
      drops = Array.from({ length: Math.floor(canvas.width * canvas.height / 3800) }, () => {
        const d = spawn(); d.y = Math.random() * canvas.height; return d
      })
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drops.forEach(d => {
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x - 2.5, d.y + d.len)
          ctx.strokeStyle = `rgba(174,214,241,${d.op})`
          ctx.lineWidth = 0.7
          ctx.stroke()
          d.y += d.speed; d.x -= 1.8
          if (d.y > canvas.height) Object.assign(d, spawn())
        })
        rainAnim.current = requestAnimationFrame(draw)
      }
      draw()
    } else {
      cancelAnimationFrame(rainAnim.current)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    return () => cancelAnimationFrame(rainAnim.current)
  }, [rainActive])

  // Parallax offset helpers
  const px = (depth: number) => {
    const ox = (mouseRef.current.x - 0.5) * depth
    const oy = (mouseRef.current.y - 0.5) * depth * 0.5
    return { transform: `translate(${ox}px, ${oy}px)`, transition: 'transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)' }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', width: '100%', height: '100%',
        overflow: 'hidden',
        background: sky.wallBg,
        transition: 'background 5s ease',
      }}
    >
      {/* ── LAYER 0: Deep space / sky background ── */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${sky.sky} 0%, ${sky.wallBg} 65%)`,
        transform: px(4).transform,
        transition: 'background 5s ease, transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)',
      }} />

      {/* Horizon glow */}
      <div style={{
        position:'absolute', left:0, right:0, top:'36%', height:'18%', zIndex:1,
        background: `linear-gradient(to bottom, ${sky.horizonGlow}, transparent)`,
        transition: 'background 5s',
        pointerEvents:'none',
      }} />

      {/* Subtle vignette for depth */}
      <div style={{
        position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
        background:'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        animation:'vignettePulse 8s ease-in-out infinite',
      }} />

      {/* ── LAYER 1: Sky / window (parallax deep) ── */}
      <div style={{ position:'absolute', top:'3%', left:'5%', width:'26%', height:'38%', zIndex:3, ...px(10) }}>
        {/* Window frame with enhanced depth */}
        <div style={{
          position:'absolute', inset:0,
          background: `linear-gradient(175deg, ${sky.sky} 0%, ${sky.skyBottom} 100%)`,
          border:'2px solid #0e1826',
          borderRadius:3,
          boxShadow: [
            'inset 0 0 60px rgba(0,0,0,0.5)',
            sky.showSun   ? '0 0 60px rgba(255,200,80,0.12)'  : '',
            sky.showMoon  ? '0 0 40px rgba(160,190,255,0.07)' : '',
          ].filter(Boolean).join(', '),
          overflow:'hidden',
          transition:'background 5s, box-shadow 5s',
        }}>
          {/* Stars in window */}
          {sky.showStars && [
            {t:'15%',l:'18%',s:2,d:2.8}, {t:'32%',l:'52%',s:1.5,d:2.2},
            {t:'58%',l:'28%',s:1,d:3.4}, {t:'22%',l:'72%',s:1.8,d:2.6},
            {t:'48%',l:'78%',s:1,d:2.0}, {t:'68%',l:'58%',s:1.3,d:3.1},
            {t:'12%',l:'42%',s:1.2,d:2.4}, {t:'75%',l:'35%',s:0.9,d:2.9},
          ].map((star, i) => (
            <div key={i} style={{
              position:'absolute', top:star.t, left:star.l,
              width:star.s, height:star.s, borderRadius:'50%', background:'#fff',
              animation:`twinkle ${star.d}s ease-in-out infinite`,
              animationDelay:`${i*0.35}s`,
              boxShadow:`0 0 ${star.s*2}px rgba(255,255,255,0.8)`,
            }} />
          ))}

          {/* Sun with rays */}
          {sky.showSun && (
            <div style={{ position:'absolute', top:'22%', right:'18%' }}>
              <div style={{
                width:32, height:32, borderRadius:'50%',
                background:'radial-gradient(circle, #fff9d0 20%, #ffe050 55%, #ffb820 100%)',
                boxShadow:'0 0 24px 8px rgba(255,210,60,0.5), 0 0 60px 20px rgba(255,180,30,0.2)',
                animation:'pulse-glow 5s ease-in-out infinite',
              }} />
            </div>
          )}

          {/* Moon with realistic shadow */}
          {sky.showMoon && (
            <div style={{ position:'absolute', top:'18%', right:'16%' }}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background:'radial-gradient(circle at 35% 35%, #e8f0ff, #b8cce8)',
                overflow:'hidden', position:'relative',
                boxShadow:'0 0 20px rgba(180,210,255,0.3), inset -3px -2px 6px rgba(0,0,0,0.2)',
              }}>
                <div style={{ position:'absolute', top:-5, right:-5, width:23, height:23, borderRadius:'50%', background: sky.sky, opacity:0.92 }} />
                {/* Craters */}
                <div style={{ position:'absolute', top:'30%', left:'20%', width:4, height:4, borderRadius:'50%', background:'rgba(0,0,0,0.12)' }} />
                <div style={{ position:'absolute', top:'55%', left:'55%', width:3, height:3, borderRadius:'50%', background:'rgba(0,0,0,0.1)' }} />
              </div>
            </div>
          )}

          {/* Window glass reflection */}
          <div style={{
            position:'absolute', top:'8%', left:'6%', width:'18%', height:'40%',
            background:'linear-gradient(135deg, rgba(255,255,255,0.06), transparent)',
            borderRadius:2,
          }} />
        </div>

        {/* Window frame bars */}
        <div style={{ position:'absolute', top:'50%', left:-2, right:-2, height:3, background:'#0e1826', transform:'translateY(-50%)', zIndex:2, boxShadow:'0 1px 4px rgba(0,0,0,0.8)' }} />
        <div style={{ position:'absolute', left:'50%', top:-2, bottom:-2, width:3, background:'#0e1826', transform:'translateX(-50%)', zIndex:2, boxShadow:'1px 0 4px rgba(0,0,0,0.8)' }} />

        {/* Window sill with depth */}
        <div style={{ position:'absolute', bottom:-10, left:-8, right:-8, height:10, background:'linear-gradient(to bottom, #1c2030, #12182a)', borderRadius:'0 0 2px 2px', boxShadow:'0 4px 12px rgba(0,0,0,0.6)' }} />

        {/* Curtains — wind sway */}
        <div style={{
          position:'absolute', top:-4, left:-14, bottom:-4, width:30,
          background:'linear-gradient(to right, #120e1e, #1a1228, #130f1c)',
          borderRight:'1px solid rgba(80,60,100,0.3)',
          animation:'sway 12s ease-in-out infinite',
          transformOrigin:'top center',
          boxShadow:'inset -4px 0 12px rgba(0,0,0,0.4)',
        }}>
          {/* Curtain fabric texture */}
          {[0,1,2,3].map(i => (
            <div key={i} style={{ position:'absolute', top:0, bottom:0, left:i*7, width:1, background:'rgba(255,255,255,0.025)' }} />
          ))}
        </div>
        <div style={{
          position:'absolute', top:-4, right:-14, bottom:-4, width:26,
          background:'linear-gradient(to left, #120e1e, #1a1228, #130f1c)',
          borderLeft:'1px solid rgba(80,60,100,0.3)',
          animation:'sway 14s ease-in-out infinite reverse',
          transformOrigin:'top center',
          boxShadow:'inset 4px 0 12px rgba(0,0,0,0.4)',
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ position:'absolute', top:0, bottom:0, right:i*7, width:1, background:'rgba(255,255,255,0.025)' }} />
          ))}
        </div>
      </div>

      {/* Moonlight / sunlight beam through window */}
      {(sky.showMoon || sky.showSun) && (
        <div style={{
          position:'absolute', top:'3%', left:'5%', width:'26%', height:'80%',
          background: sky.showMoon
            ? 'linear-gradient(175deg, rgba(160,190,255,0.04) 0%, transparent 60%)'
            : 'linear-gradient(175deg, rgba(255,220,120,0.05) 0%, transparent 50%)',
          zIndex:2, pointerEvents:'none',
          transition:'background 5s',
        }} />
      )}

      {/* ── LAYER 2: Atmospheric fog (parallax mid) ── */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', ...px(6) }}>
        <div style={{
          position:'absolute', bottom:'30%', left:'-5%', right:'-5%', height:'15%',
          background:`linear-gradient(to top, ${sky.fogColor}, transparent)`,
          animation:'fogDrift 18s ease-in-out infinite',
          filter:'blur(8px)',
          transition:'background 5s',
        }} />
        <div style={{
          position:'absolute', bottom:'38%', left:'-5%', right:'-5%', height:'10%',
          background:`linear-gradient(to top, ${sky.fogColor.replace('0.06','0.03')}, transparent)`,
          animation:'fogDrift 24s ease-in-out infinite reverse',
          filter:'blur(12px)',
          transition:'background 5s',
        }} />
      </div>

      {/* ── LAYER 3: Wall ── */}
      <div style={{
        position:'absolute', left:0, right:0, top:'41%', height:'38%', zIndex:3,
        background: tod === 'night' || tod === 'evening'
          ? 'linear-gradient(to bottom, #0a0e18, #080c14)'
          : 'linear-gradient(to bottom, #15151e, #101018)',
        borderTop:'1px solid rgba(255,255,255,0.04)',
        transition:'background 5s',
      }}>
        {/* Subtle wall texture lines */}
        <div style={{
          position:'absolute', inset:0,
          background:`repeating-linear-gradient(90deg, transparent 0, transparent 79px, rgba(255,255,255,0.012) 79px, rgba(255,255,255,0.012) 80px)`,
        }} />
        {/* Ambient glow on wall from lamp */}
        {sky.lampOpacity > 0 && (
          <div style={{
            position:'absolute', top:0, left:'3%', width:'30%', height:'80%',
            background:`radial-gradient(ellipse at 20% 0%, rgba(255,220,100,${sky.lampOpacity * 0.06}), transparent 70%)`,
            transition:'background 3s',
            animation:'glowPulse 6s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* ── LAYER 4: Floor ── */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'21%', zIndex:3,
        background:'linear-gradient(to bottom, #070a12, #050810)',
        borderTop:'1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Floor boards */}
        <div style={{
          position:'absolute', inset:0,
          background:`repeating-linear-gradient(90deg, transparent 0, transparent 89px, rgba(255,255,255,0.018) 89px, rgba(255,255,255,0.018) 90px)`,
        }} />
        {/* Floor reflection from desk lamp */}
        {sky.lampOpacity > 0.3 && (
          <div style={{
            position:'absolute', top:0, left:'0%', width:'40%', height:'60%',
            background:`radial-gradient(ellipse at 22% 0%, rgba(255,220,100,${sky.lampOpacity * 0.04}), transparent 70%)`,
            transition:'background 3s',
          }} />
        )}
      </div>

      {/* ── LAYER 5: Desk ── */}
      {/* Desk surface */}
      <div style={{
        position:'absolute', left:'3%', right:'3%', bottom:'18.5%', height:'4%', zIndex:4,
        background:'linear-gradient(to bottom, #3a2412, #2c1c0e)',
        borderRadius:'3px 3px 0 0',
        borderTop:'1.5px solid #4a2e14',
        boxShadow:'0 -2px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
      }} />
      {/* Desk front face */}
      <div style={{
        position:'absolute', left:'3%', right:'3%', bottom:'14.5%', height:'4%', zIndex:4,
        background:'linear-gradient(to bottom, #221408, #1a1006)',
        borderLeft:'1px solid #3a2010', borderRight:'1px solid #3a2010',
      }} />
      {/* Desk legs */}
      {[{l:'6%'}, {l:'90%'}].map((leg, i) => (
        <div key={i} style={{
          position:'absolute', bottom:0, left:leg.l, width:'2.2%', height:'14.5%', zIndex:4,
          background:'linear-gradient(to right, #1e1208, #161008)',
          borderRadius:'0 0 3px 3px',
          boxShadow:'2px 0 8px rgba(0,0,0,0.5)',
        }} />
      ))}

      {/* ── LAYER 6: Desk objects (parallax foreground) ── */}
      <div style={{ position:'absolute', bottom:'22.5%', left:0, right:0, zIndex:5, ...px(-4) }}>

        {/* LAMP */}
        <div style={{ position:'absolute', left:'7%', bottom:0 }}>
          {/* Lamp cone glow on desk */}
          {sky.lampOpacity > 0.2 && (
            <div style={{
              position:'absolute', bottom:-2, left:-50, width:160, height:120,
              background:`radial-gradient(ellipse at 35% 0%, rgba(255,220,100,${sky.lampOpacity * 0.18}), transparent 70%)`,
              pointerEvents:'none',
              animation:'glowPulse 6s ease-in-out infinite',
              transition:'background 3s',
            }} />
          )}
          {/* Base */}
          <div style={{ width:36, height:7, background:'linear-gradient(to bottom, #9098a8, #7080a0)', borderRadius:3, margin:'0 auto', boxShadow:'0 2px 6px rgba(0,0,0,0.5)' }} />
          {/* Pole */}
          <div style={{ width:3, height:64, background:'linear-gradient(to right, #8090a8, #6878a0)', borderRadius:2, margin:'0 auto' }} />
          {/* Joint */}
          <div style={{ width:9, height:9, borderRadius:'50%', background:'#8898b0', margin:'-2px auto 0', boxShadow:'0 1px 4px rgba(0,0,0,0.5)' }} />
          {/* Arm */}
          <div style={{ width:3, height:26, background:'linear-gradient(to right, #7888a0, #6070a0)', borderRadius:2, margin:'0 auto', transform:'rotate(22deg)', transformOrigin:'bottom center' }} />
          {/* Shade */}
          <div style={{
            width:46, height:24, marginLeft:-10, marginTop:-18, position:'relative',
            background:'linear-gradient(to bottom, #ccd4e8, #b8c4d8)',
            borderRadius:'5px 5px 13px 13px',
            borderTop:'1.5px solid #d8e0f0',
            boxShadow: sky.lampOpacity > 0.2
              ? `0 0 30px rgba(255,220,100,${sky.lampOpacity * 0.6}), 0 0 60px rgba(255,200,80,${sky.lampOpacity * 0.25})`
              : 'none',
            animation:'lampFlicker 9s linear infinite',
            transition:'box-shadow 3s',
          }}>
            <div style={{ position:'absolute', inset:'3px 5px 0', background:'linear-gradient(to bottom, #b8c0d4, #a8b4c8)', borderRadius:'3px 3px 11px 11px' }} />
            {/* Bulb */}
            <div style={{
              position:'absolute', bottom:3, left:'50%', transform:'translateX(-50%)',
              width:7, height:7, borderRadius:'50%',
              background:'#ffe890',
              opacity: sky.lampOpacity,
              boxShadow: sky.lampOpacity > 0.2 ? '0 0 10px 4px rgba(255,230,100,0.7)' : 'none',
              transition:'opacity 3s, box-shadow 3s',
            }} />
          </div>
        </div>

        {/* COFFEE MUG */}
        <div style={{ position:'absolute', left:'27%', bottom:0 }}>
          {/* Steam wisps */}
          {[0,1,2].map(i => (
            <div key={i} style={{
              position:'absolute', bottom:46, left:5+i*7, width:2.5,
              height:16+i*3, borderRadius:3,
              background:'rgba(210,220,240,0.45)',
              animation:`steamRise ${2.2+i*0.35}s ease-out infinite`,
              animationDelay:`${-i*0.7}s`,
              filter:'blur(0.5px)',
            }} />
          ))}
          {/* Mug body */}
          <div style={{
            width:36, height:40, position:'relative',
            background:'linear-gradient(to bottom right, #eceef5, #d8dae6)',
            borderRadius:'4px 4px 8px 8px',
            border:'1px solid #c4c6d4',
            boxShadow:'2px 4px 12px rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.3)',
          }}>
            <div style={{ position:'absolute', top:3, left:3, right:3, height:8, background:'#180c05', borderRadius:'2px 2px 0 0' }} />
            <div style={{ position:'absolute', top:4, left:4, right:4, height:6, background:'radial-gradient(ellipse at 38% 40%, #4a240c, #180c05)', borderRadius:2 }} />
            {/* Handle */}
            <div style={{ position:'absolute', right:-12, top:9, width:12, height:18, border:'3px solid #c8cad8', borderLeft:'none', borderRadius:'0 9px 9px 0' }} />
            {/* Logo mark */}
            <div style={{ position:'absolute', top:15, left:7, width:10, height:9, borderRadius:'50%', border:'1.5px solid rgba(140,150,190,0.3)' }} />
          </div>
          {/* Saucer */}
          <div style={{ width:52, height:6, background:'linear-gradient(to bottom, #d8dae6, #c8cad8)', borderRadius:'50%', border:'1px solid #b8bad0', margin:'0 auto', boxShadow:'0 2px 6px rgba(0,0,0,0.4)' }} />
        </div>

        {/* BOOK STACK */}
        <div style={{ position:'absolute', left:'40%', bottom:0, display:'flex', flexDirection:'column', gap:1.5 }}>
          {[
            { w:56, h:9,  bg:'linear-gradient(to right, #1d3060, #243880)', bl:'#4060b0', shadow:'0 2px 8px rgba(0,0,0,0.6)' },
            { w:52, h:10, bg:'linear-gradient(to right, #1e3a1e, #254825)', bl:'#3a6038', shadow:'0 2px 8px rgba(0,0,0,0.5)' },
            { w:54, h:9,  bg:'linear-gradient(to right, #3d1515, #4e1c1c)', bl:'#7a2828', shadow:'0 2px 8px rgba(0,0,0,0.5)' },
          ].map((b, i) => (
            <div key={i} style={{
              width:b.w, height:b.h,
              background:b.bg,
              borderRadius:'1px 3px 3px 1px',
              borderLeft:`3px solid ${b.bl}`,
              boxShadow:b.shadow,
            }} />
          ))}
        </div>

        {/* NOTEPAD */}
        <div style={{
          position:'absolute', left:'52%', bottom:0, width:50, height:65,
          background:'linear-gradient(to bottom, #f2ede0, #ece8d8)',
          borderRadius:'2px 2px 1px 1px', border:'1px solid #d0c8b8',
          boxShadow:'2px 4px 12px rgba(0,0,0,0.5)',
        }}>
          <div style={{ height:9, background:'linear-gradient(to bottom, #b8b0a0, #a8a090)', borderRadius:'2px 2px 0 0' }} />
          <div style={{ padding:'9px 5px 4px', display:'flex', flexDirection:'column', gap:5.5 }}>
            {[0,1,2,3,4,5].map(i => <div key={i} style={{ height:1, background:'rgba(80,100,140,0.18)' }} />)}
          </div>
        </div>

        {/* PENCIL CUP */}
        <div style={{
          position:'absolute', left:'62%', bottom:0, width:22, height:30,
          background:'linear-gradient(to bottom, #1e2a3e, #141e2e)',
          borderRadius:'2px 2px 5px 5px', border:'1px solid #2a3650',
          boxShadow:'2px 4px 10px rgba(0,0,0,0.6)',
        }}>
          {[
            { l:3,  h:42, bg:'#e8a020', shadow:'0 0 4px rgba(232,160,32,0.3)' },
            { l:9,  h:36, bg:'#c03030', shadow:'0 0 4px rgba(192,48,48,0.3)' },
            { l:15, h:40, bg:'#4060c0', shadow:'0 0 4px rgba(64,96,192,0.3)' },
          ].map((p, i) => (
            <div key={i} style={{
              position:'absolute', left:p.l, bottom:30, width:3.5, height:p.h,
              background:p.bg, borderRadius:'1.5px 1.5px 0 0',
              boxShadow:p.shadow,
            }} />
          ))}
        </div>
      </div>

      {/* ── PLANT (separate parallax layer) ── */}
      <div style={{ position:'absolute', bottom:'22.5%', right:'12%', zIndex:5, ...px(-6) }}>
        <div style={{ position:'relative' }}>
          {/* Pot */}
          <div style={{
            width:42, height:34, background:'linear-gradient(to bottom right, #9B5523, #7a4018)',
            borderRadius:'2px 2px 6px 6px', border:'1px solid #6B3410',
            margin:'0 auto', position:'relative',
            boxShadow:'2px 6px 14px rgba(0,0,0,0.7)',
          }}>
            <div style={{ position:'absolute', top:0, left:-4, right:-4, height:7, background:'linear-gradient(to bottom, #a86030, #8a4820)', borderRadius:3, border:'1px solid #7B4515' }} />
            <div style={{ position:'absolute', top:7, left:5, right:5, height:5, background:'#251808', borderRadius:1 }} />
          </div>
          {/* Stem */}
          <div style={{
            position:'absolute', bottom:32, left:'50%', marginLeft:-2, width:4, height:70,
            background:'linear-gradient(to right, #2d5a1e, #3a7028)',
            borderRadius:2,
            animation:'leafSway 6s ease-in-out infinite', transformOrigin:'bottom center',
          }}>
            {[
              { w:34, h:18, bg:'#1a6028', t:6,  l:4,   transform:'rotate(-38deg)', r:'3s' },
              { w:30, h:16, bg:'#1e7030', t:18, l:-32, transform:'rotate(34deg)',  r:'3.5s' },
              { w:38, h:20, bg:'#155224', t:32, l:4,   transform:'rotate(-50deg)', r:'4s' },
              { w:32, h:17, bg:'#1c6a2c', t:46, l:-36, transform:'rotate(42deg)',  r:'4.5s' },
              { w:24, h:13, bg:'#247030', t:22, l:4,   transform:'rotate(-22deg)', r:'3.2s' },
            ].map((leaf, i) => (
              <div key={i} style={{
                position:'absolute', top:leaf.t, left:leaf.l,
                width:leaf.w, height:leaf.h, background:leaf.bg,
                borderRadius:'50% 10% 50% 10%', transform:leaf.transform,
                animation:`leafSway ${leaf.r} ease-in-out infinite`,
                animationDelay:`${-i*0.6}s`,
                boxShadow:'inset 0 2px 4px rgba(0,0,0,0.2)',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CRT TERMINAL ── */}
      <div style={{
        position:'absolute', bottom:'22.5%', right:'4%', zIndex:5,
        width:'21%', minWidth:165,
        filter:'drop-shadow(0 8px 24px rgba(0,0,0,0.7))',
        ...px(-3),
      }}>
        <CrtTerminal />
      </div>

      {/* ── Dust/mote particles ── */}
      <canvas
        ref={dustCanvas}
        style={{
          position:'absolute', inset:0, zIndex:6,
          pointerEvents:'none', opacity:0.7,
        }}
      />

      {/* ── Rain canvas ── */}
      <canvas
        ref={rainCanvas}
        style={{
          position:'absolute', inset:0, zIndex:8,
          pointerEvents:'none',
          opacity: rainActive ? 1 : 0,
          transition:'opacity 1.8s ease',
        }}
      />

      {/* Rain atmosphere darkening */}
      <div style={{
        position:'absolute', inset:0, zIndex:7, pointerEvents:'none',
        background:'rgba(10,15,30,0.22)',
        opacity: rainActive ? 1 : 0,
        transition:'opacity 1.8s ease',
      }} />
    </div>
  )
}
