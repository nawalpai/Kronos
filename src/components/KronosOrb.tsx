import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Three tilted rings, like an astrolabe, that stand in for the hour / day / year
// cycles Kronos is named for. Each spins at its own rate on its own axis.
function Ring({
  radius,
  tube,
  rotationAxis,
  speed,
  tilt,
  color,
}: {
  radius: number
  tube: number
  rotationAxis: 'x' | 'y' | 'z'
  speed: number
  tilt: [number, number, number]
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation[rotationAxis] += delta * speed
  })
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, tube, 16, 120]} />
      <meshStandardMaterial
        color={color}
        metalness={0.85}
        roughness={0.28}
        emissive={color}
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

function ClockHand({ length, width, speed, color, yOffset = 0 }: { length: number; width: number; speed: number; color: string; yOffset?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z -= delta * speed
  })
  return (
    <group ref={ref} position={[0, yOffset, 0.62]}>
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[width, length, width]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} emissive={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function Core() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.15
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.58, 2]} />
      <meshStandardMaterial
        color="#6ee7d8"
        metalness={0.2}
        roughness={0.15}
        emissive="#6ee7d8"
        emissiveIntensity={0.55}
        wireframe
      />
    </mesh>
  )
}

function TickMarks() {
  const ticks = useMemo(() => {
    const arr: { position: [number, number, number]; rotation: [number, number, number] }[] = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      arr.push({
        position: [Math.sin(angle) * 1.55, Math.cos(angle) * 1.55, 0],
        rotation: [0, 0, -angle],
      })
    }
    return arr
  }, [])
  return (
    <group>
      {ticks.map((t, i) => (
        <mesh key={i} position={t.position} rotation={t.rotation}>
          <boxGeometry args={[0.03, i % 3 === 0 ? 0.14 : 0.07, 0.03]} />
          <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Particles() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 260
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.4 + Math.random() * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [])
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.04
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#e8c05c" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

function Scene({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y += (pointer.current.x * 0.4 - group.current.rotation.y) * 0.04
    group.current.rotation.x += (pointer.current.y * -0.25 - group.current.rotation.x) * 0.04
  })
  return (
    <group ref={group}>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 4]} intensity={40} color="#e8c05c" />
      <pointLight position={[-4, -2, -3]} intensity={22} color="#6ee7d8" />
      <Core />
      <TickMarks />
      <ClockHand length={0.95} width={0.035} speed={0.35} color="#e8c05c" />
      <ClockHand length={0.62} width={0.05} speed={0.9} color="#f2f0e8" />
      <Ring radius={1.55} tube={0.012} rotationAxis="y" speed={0.18} tilt={[Math.PI / 2.4, 0, 0]} color="#c9a227" />
      <Ring radius={1.95} tube={0.01} rotationAxis="x" speed={-0.12} tilt={[0.3, 0.6, 0]} color="#8a6a1a" />
      <Ring radius={2.3} tube={0.008} rotationAxis="z" speed={0.09} tilt={[1.1, 0.2, 0.4]} color="#6ee7d8" />
      <Particles />
    </group>
  )
}

export default function KronosOrb() {
  const pointer = useRef({ x: 0, y: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    const handle = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', handle)
    return () => window.removeEventListener('pointermove', handle)
  }, [])

  if (!ready) return null

  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene pointer={pointer} />
      </Canvas>
    </div>
  )
}
