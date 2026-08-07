import { useEffect, useRef } from 'react'
import { useNow } from '../../lib/useNow'
import { getTimeOfDay } from '../../lib/timezones'
import type { CityZone } from '../../lib/timezones'
import CrtTerminal from './CrtTerminal'

interface SkyConfig {
  sky: string; skyBottom: string; wallBg: string; wallTint: string
  showSun: boolean; showMoon: boolean; showStars: boolean
  lampOpacity: number; ambientTint: string
}

function getSkyConfig(tod: ReturnType<typeof getTimeOfDay>): SkyConfig {
  switch (tod) {
    case 'dawn':        return { sky:'#1a0a28', skyBottom:'#e8703a', wallBg:'#1a1018', wallTint:'rgba(232,112,58,0.06)', showSun:false, showMoon:true,  showStars:true,  lampOpacity:0.4,  ambientTint:'rgba(232,112,58,0.05)' }
    case 'morning':     return { sky:'#1a6fa8', skyBottom:'#c8eeff', wallBg:'#181820', wallTint:'rgba(100,200,255,0.05)', showSun:true,  showMoon:false, showStars:false, lampOpacity:0,    ambientTint:'rgba(100,200,255,0.04)' }
    case 'noon':        return { sky:'#0d5fa0', skyBottom:'#5ac0f0', wallBg:'#181828', wallTint:'rgba(90,192,240,0.06)', showSun:true,  showMoon:false, showStars:false, lampOpacity:0,    ambientTint:'rgba(90,192,240,0.03)' }
    case 'afternoon':   return { sky:'#1a5898', skyBottom:'#7ac8f0', wallBg:'#18181e', wallTint:'rgba(122,200,240,0.05)', showSun:true,  showMoon:false, showStars:false, lampOpacity:0,    ambientTint:'rgba(122,200,240,0.03)' }
    case 'evening':     return { sky:'#0a0a1a', skyBottom:'#d86020', wallBg:'#140e0a', wallTint:'rgba(216,96,32,0.08)', showSun:false, showMoon:false, showStars:false, lampOpacity:0.7,  ambientTint:'rgba(216,96,32,0.07)' }
    default:            return { sky:'#050810', skyBottom:'#050810', wallBg:'#0d0d16', wallTint:'rgba(0,0,0,0)',         showSun:false, showMoon:true,  showStars:true,  lampOpacity:1,    ambientTint:'rgba(0,0,0,0)' }
  }
}

interface Props { activeCity: CityZone; rainActive: boolean }

export default function DeskScene({ activeCity, rainActive }: Props) {
  const now = useNow()
  const rainCanvas = useRef<HTMLCanvasElement>(null)
  const rainAnim   = useRef<number>(0)
  const rainDrops  = useRef<{x:number;y:number;len:number;speed:number;op:number}[]>([])

  const localStr  = now.toLocaleString('en-US', { timeZone: activeCity.iana })
  const localDate = new Date(localStr)
  const tod       = getTimeOfDay(localDate.getHours())
  const sky       = getSkyConfig(tod)

  // Rain canvas
  useEffect(() => {
    const canvas = rainCanvas.current
    if (!canvas) return
    const parent = canvas.parentElement!
    canvas.width  = parent.clientWidth
    canvas.height = parent.clientHeight
    const ctx = canvas.getContext('2d')!

    const spawn = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -100,
      len: 10 + Math.random() * 12,
      speed: 10 + Math.random() * 6,
      op: 0.15 + Math.random() * 0.35,
    })

    if (rainActive) {
      rainDrops.current = Array.from({ length: Math.floor(canvas.width * canvas.height / 4000) }, () => {
        const d = spawn(); d.y = Math.random() * canvas.height; return d
      })
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        rainDrops.current.forEach(d => {
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x - 2, d.y + d.len)
          ctx.strokeStyle = `rgba(174,214,241,${d.op})`
          ctx.lineWidth = 0.8
          ctx.stroke()
          d.y += d.speed; d.x -= 1.5
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

  const W = '100%', H = '100%'

  return (
    <div style={{ position: 'relative', width: W, height: H, overflow: 'hidden', transition: 'background 4s ease', background: sky.wallBg }}>

      {/* Ambient wall tint */}
      <div style={{ position:'absolute', inset:0, background: sky.wallTint, transition:'background 4s', pointerEvents:'none', zIndex:1 }} />

      {/* SKY WINDOW */}
      <div style={{
        position:'absolute', top:'4%', left:'6%', width:'24%', height:'35%',
        background: `linear-gradient(180deg, ${sky.sky} 0%, ${sky.skyBottom} 100%)`,
        border:'3px solid #1a2540', borderRadius:'2px',
        transition:'background 4s ease',
        boxShadow: sky.showSun ? '0 0 40px rgba(255,200,80,0.15) inset' : sky.showMoon ? '0 0 30px rgba(180,210,255,0.08) inset' : 'none',
        zIndex: 2,
      }}>
        {/* Stars */}
        {sky.showStars && [
          {t:'18%',l:'20%',s:2}, {t:'35%',l:'55%',s:1.5}, {t:'60%',l:'30%',s:1},
          {t:'25%',l:'75%',s:1.5}, {t:'50%',l:'80%',s:1}, {t:'70%',l:'60%',s:1.2},
        ].map((star, i) => (
          <div key={i} style={{
            position:'absolute', top:star.t, left:star.l,
            width:star.s, height:star.s, borderRadius:'50%', background:'#fff',
            animation:`twinkle ${2+i*0.5}s ease-in-out infinite`,
            animationDelay:`${i*0.4}s`,
          }} />
        ))}

        {/* Sun */}
        {sky.showSun && (
          <div style={{
            position:'absolute', top:'25%', right:'20%',
            width:28, height:28, borderRadius:'50%',
            background:'radial-gradient(circle, #fff8c0 30%, #ffdd44 65%, #ffaa00 100%)',
            boxShadow:'0 0 20px rgba(255,200,50,0.8), 0 0 50px rgba(255,180,30,0.4)',
            animation:'pulse-glow 5s ease-in-out infinite',
          }} />
        )}

        {/* Moon */}
        {sky.showMoon && (
          <div style={{ position:'absolute', top:'20%', right:'18%', width:24, height:24 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', background:'#c8d8f0', position:'relative', overflow:'hidden', boxShadow:'0 0 16px rgba(180,210,255,0.25)' }}>
              <div style={{ position:'absolute', top:-4, right:-4, width:20, height:20, borderRadius:'50%', background: sky.sky }} />
            </div>
          </div>
        )}

        {/* Window cross bars */}
        <div style={{ position:'absolute', top:'50%', left:0, right:0, height:3, background:'#1a2540', transform:'translateY(-50%)' }} />
        <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:3, background:'#1a2540', transform:'translateX(-50%)' }} />

        {/* Curtains */}
        <div style={{ position:'absolute', top:-3, left:-3, bottom:-3, width:26, background:'#1a1228', borderRight:'1px solid #231632', animation:'sway 10s ease-in-out infinite' }} />
        <div style={{ position:'absolute', top:-3, right:-3, bottom:-3, width:22, background:'#1a1228', borderLeft:'1px solid #231632', animation:'sway 11.5s ease-in-out infinite reverse' }} />
      </div>

      {/* WALL */}
      <div style={{
        position:'absolute', left:0, right:0, top:'42%', height:'36%',
        background:'#0c1220', borderTop:'1px solid #1a2540',
        transition:'background 4s',
        ...(tod !== 'night' && tod !== 'evening' ? { background:'#1a1a24' } : {}),
        zIndex:3,
      }} />

      {/* FLOOR */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height:'22%',
        background:'#090d18', borderTop:'2px solid #131e30', zIndex:3,
      }} />

      {/* DESK SURFACE */}
      <div style={{
        position:'absolute', left:'4%', right:'4%', bottom:'19.5%',
        height:'3%', background:'#2c1c0e', borderRadius:'2px 2px 0 0',
        borderTop:'2px solid #3e2810', zIndex:4,
      }} />
      <div style={{
        position:'absolute', left:'4%', right:'4%', bottom:'16%',
        height:'3.5%', background:'#221408',
        borderLeft:'1px solid #3e2810', borderRight:'1px solid #3e2810', zIndex:4,
      }} />

      {/* Desk legs */}
      {['7%','88%'].map((l, i) => (
        <div key={i} style={{
          position:'absolute', bottom:0, left:l, width:'2.5%', height:'16%',
          background:'#1a1008', borderRadius:'0 0 2px 2px', zIndex:4,
        }} />
      ))}

      {/* LAMP */}
      <div style={{ position:'absolute', bottom:'22.5%', left:'8%', zIndex:5 }}>
        <div style={{ width:38, height:6, background:'#8090a8', borderRadius:2, margin:'0 auto' }} />
        <div style={{ width:4, height:60, background:'#7080a0', borderRadius:2, margin:'0 auto' }} />
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#8090a8', margin:'-2px auto 0' }} />
        <div style={{ width:3, height:24, background:'#7080a0', borderRadius:2, margin:'0 auto', transform:'rotate(20deg)', transformOrigin:'bottom center' }} />
        <div style={{
          width:42, height:22, background:'#d0d8e8', borderRadius:'4px 4px 10px 10px',
          marginLeft:-6, marginTop:-16, position:'relative',
          boxShadow: sky.lampOpacity > 0.3 ? `0 0 40px rgba(255,220,100,${sky.lampOpacity * 0.5})` : 'none',
          animation: 'lampFlicker 8s linear infinite',
          transition: 'box-shadow 3s',
        }}>
          <div style={{
            position:'absolute', bottom:2, left:'50%', transform:'translateX(-50%)',
            width:6, height:6, borderRadius:'50%', background:'#ffe080',
            opacity: sky.lampOpacity,
            boxShadow: sky.lampOpacity > 0.3 ? '0 0 8px #ffe080' : 'none',
          }} />
        </div>
        {/* Lamp cone glow */}
        {sky.lampOpacity > 0.3 && (
          <div style={{
            position:'absolute', bottom:-90, left:-24, width:96, height:110,
            background:`radial-gradient(ellipse at 50% 0%, rgba(255,220,100,${sky.lampOpacity * 0.14}), transparent 75%)`,
            pointerEvents:'none', animation:'lampFlicker 8s linear infinite',
          }} />
        )}
      </div>

      {/* COFFEE MUG */}
      <div style={{ position:'absolute', bottom:'23%', left:'28%', zIndex:5 }}>
        {/* Steam */}
        {[0,1,2].map(i => (
          <div key={i} style={{
            position:'absolute', bottom:44, left:4+i*6, width:2.5, height:18+i*2,
            borderRadius:2, background:'rgba(210,220,240,0.5)',
            animation:`steamRise ${2.3+i*0.3}s ease-out infinite`,
            animationDelay:`${-i*0.6}s`,
          }} />
        ))}
        <div style={{ width:34, height:38, background:'#e8eaf0', borderRadius:'4px 4px 7px 7px', position:'relative', border:'1px solid #c8cad8' }}>
          <div style={{ position:'absolute', top:3, left:3, right:3, height:7, background:'#1a0c06', borderRadius:'2px 2px 0 0' }} />
          <div style={{ position:'absolute', top:4, left:4, right:4, height:5, background:'radial-gradient(ellipse at 40%, #3d1f0a, #1a0c06)', borderRadius:2 }} />
          <div style={{ position:'absolute', right:-10, top:8, width:10, height:16, border:'3px solid #d8dae8', borderLeft:'none', borderRadius:'0 8px 8px 0' }} />
        </div>
        <div style={{ width:48, height:6, background:'#dddfe8', borderRadius:'50%', border:'1px solid #c0c2d0', margin:'0 auto' }} />
      </div>

      {/* BOOK STACK */}
      <div style={{ position:'absolute', bottom:'23%', left:'40%', zIndex:5, display:'flex', flexDirection:'column', gap:1 }}>
        {[
          { w:54, h:8, bg:'#1d3060', bl:'#3050a0' },
          { w:50, h:9, bg:'#1e3a1e', bl:'#305030' },
          { w:52, h:8, bg:'#3d1515', bl:'#6a2020' },
        ].map((b, i) => (
          <div key={i} style={{ width:b.w, height:b.h, background:b.bg, borderRadius:'1px 2px 2px 1px', borderLeft:`3px solid ${b.bl}` }} />
        ))}
      </div>

      {/* NOTEPAD */}
      <div style={{ position:'absolute', bottom:'23%', left:'52%', zIndex:5, width:48, height:62, background:'#f0ece0', borderRadius:2, border:'1px solid #d8d2c0' }}>
        <div style={{ height:8, background:'#c0b8a8', borderRadius:'2px 2px 0 0' }} />
        <div style={{ padding:'8px 4px 4px', display:'flex', flexDirection:'column', gap:5 }}>
          {[0,1,2,3,4,5].map(i => <div key={i} style={{ height:1, background:'rgba(80,100,140,0.2)' }} />)}
        </div>
      </div>

      {/* PENCIL CUP */}
      <div style={{ position:'absolute', bottom:'23%', left:'61%', zIndex:5, width:20, height:28, background:'#1a2438', borderRadius:'2px 2px 4px 4px', border:'1px solid #253040' }}>
        {[
          { l:3, h:38, bg:'#e8a020' },
          { l:9, h:32, bg:'#c03030' },
          { l:15, h:36, bg:'#4060c0' },
        ].map((p, i) => (
          <div key={i} style={{ position:'absolute', left:p.l, bottom:28, width:3, height:p.h, background:p.bg, borderRadius:'1px 1px 0 0' }} />
        ))}
      </div>

      {/* PLANT */}
      <div style={{ position:'absolute', bottom:'23%', right:'14%', zIndex:5 }}>
        {/* Pot */}
        <div style={{ width:40, height:32, background:'#8B4513', borderRadius:'2px 2px 5px 5px', border:'1px solid #6B3410', margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:-3, right:-3, height:6, background:'#9B5523', borderRadius:2, border:'1px solid #7B4515' }} />
          <div style={{ position:'absolute', top:6, left:4, right:4, height:4, background:'#2a1a0a', borderRadius:1 }} />
        </div>
        {/* Stem */}
        <div style={{ position:'absolute', bottom:30, left:'50%', marginLeft:-2, width:4, height:66, background:'#2d5a1e', borderRadius:2, animation:'leafSway 5s ease-in-out infinite', transformOrigin:'bottom center' }}>
          {/* Leaves */}
          {[
            { w:32, h:17, bg:'#1a6028', t:8,  l:4,  r:-36, transform:'rotate(-38deg)' },
            { w:28, h:15, bg:'#1e7030', t:20, l:-32, r:0,   transform:'rotate(33deg)' },
            { w:36, h:19, bg:'#155224', t:34, l:4,   r:-40, transform:'rotate(-48deg)' },
            { w:30, h:16, bg:'#1c6a2c', t:46, l:-34, r:0,   transform:'rotate(40deg)' },
          ].map((leaf, i) => (
            <div key={i} style={{
              position:'absolute', top:leaf.t, left:leaf.l,
              width:leaf.w, height:leaf.h, background:leaf.bg,
              borderRadius:'50% 10% 50% 10%', transform:leaf.transform,
              animation:`leafSway ${4+i*0.5}s ease-in-out infinite`,
              animationDelay:`${-i*0.7}s`,
            }} />
          ))}
        </div>
      </div>

      {/* CRT TERMINAL */}
      <div style={{
        position:'absolute', bottom:'23%', right:'5%', zIndex:5,
        width:'20%', minWidth:160,
      }}>
        <CrtTerminal />
      </div>

      {/* Rain overlay canvas */}
      <canvas
        ref={rainCanvas}
        style={{
          position:'absolute', inset:0, zIndex:9,
          pointerEvents:'none', opacity: rainActive ? 1 : 0,
          transition:'opacity 1.5s',
        }}
      />

      {/* Rain darkening overlay */}
      {rainActive && (
        <div style={{
          position:'absolute', inset:0, zIndex:8, pointerEvents:'none',
          background:'rgba(0,0,0,0.18)', transition:'opacity 1.5s',
        }} />
      )}
    </div>
  )
}
