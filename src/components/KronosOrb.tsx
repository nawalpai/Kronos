import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function ArmillaryRing({ radius, tubeRadius, color, rotation, speed }: {
  radius: number; tubeRadius: number; color: string
  rotation: [number, number, number]; speed: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed
  })
  const geo = useMemo(() => new THREE.TorusGeometry(radius, tubeRadius, 16, 100), [radius, tubeRadius])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color, metalness: 0.9, roughness: 0.15,
    emissive: color, emissiveIntensity: 0.15,
  }), [color])
  return (
    <mesh ref={ref} geometry={geo} material={mat} rotation={rotation} />
  )
}

function OrbitingParticle({ radius, speed, size, color, startAngle }: {
  radius: number; speed: number; size: number; color: string; startAngle: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + startAngle
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = Math.sin(t * 0.7) * 0.3
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
    </mesh>
  )
}

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.15
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.1
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 64, 64]} />
      <meshStandardMaterial
        color="#0a0b10"
        metalness={0.3}
        roughness={0.7}
        emissive="#1a1500"
        emissiveIntensity={0.3}
        wireframe={false}
      />
    </mesh>
  )
}

function WireCore() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = -clock.getElapsedTime() * 0.1
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.56, 16, 16]} />
      <meshStandardMaterial
        color="#c9a227"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

function FloatingGroup() {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.08
    group.current.rotation.y += (pointer.x * 0.3 - group.current.rotation.y) * 0.05
    group.current.rotation.x += (-pointer.y * 0.15 - group.current.rotation.x) * 0.05
  })

  const gold = '#c9a227'
  const goldLight = '#e8c05c'
  const teal = '#6ee7d8'

  return (
    <group ref={group}>
      <CoreSphere />
      <WireCore />

      {/* Three rings */}
      <ArmillaryRing radius={1.3} tubeRadius={0.018} color={gold}      rotation={[0, 0, 0]}                speed={0.18} />
      <ArmillaryRing radius={1.3} tubeRadius={0.018} color={goldLight} rotation={[Math.PI/2, 0, Math.PI/6]} speed={-0.12} />
      <ArmillaryRing radius={1.3} tubeRadius={0.018} color={teal}      rotation={[Math.PI/3, Math.PI/4, 0]} speed={0.22} />

      {/* Tick marks on outer ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const r = 1.32
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}>
            <boxGeometry args={[0.012, 0.012, 0.04]} />
            <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.5} />
          </mesh>
        )
      })}

      {/* Orbiting particles */}
      {[...Array(6)].map((_, i) => (
        <OrbitingParticle
          key={i}
          radius={1.6 + (i % 2) * 0.2}
          speed={0.4 + i * 0.07}
          size={0.028 + (i % 3) * 0.01}
          color={i % 2 === 0 ? gold : teal}
          startAngle={(i / 6) * Math.PI * 2}
        />
      ))}
    </group>
  )
}

export default function KronosOrb() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 4, 4]} intensity={6} color="#e8c05c" />
        <pointLight position={[-4, -2, -4]} intensity={2} color="#6ee7d8" />
        <pointLight position={[0, 0, 4]} intensity={1} color="#ffffff" />
        <FloatingGroup />
      </Canvas>
    </div>
  )
}
