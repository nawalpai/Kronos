import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  z: number
  vx: number
  vy: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000))
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
    }))

    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / width - 0.5) * 2
      mouse.current.y = (e.clientY / height - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', resize)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx + mouse.current.x * p.z * 0.15
          p.y += p.vy + mouse.current.y * p.z * 0.15
          if (p.x < 0) p.x = width
          if (p.x > width) p.x = 0
          if (p.y < 0) p.y = height
          if (p.y > height) p.y = 0
        }
        const size = p.z * 1.6
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 162, 39, ${0.15 + p.z * 0.25})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 18% 12%, rgba(201,162,39,0.14), transparent 60%), radial-gradient(50% 45% at 82% 78%, rgba(110,231,216,0.10), transparent 60%), #0a0b10',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
