import { useState } from 'react'
import { motion } from 'framer-motion'
import { CITY_LIBRARY } from '../lib/timezones'
import type { CityZone } from '../lib/timezones'
import { usePersistentState } from '../lib/usePersistentState'
import DashboardTopBar from '../components/dashboard/DashboardTopBar'
import WorldClockPanel from '../components/dashboard/WorldClockPanel'
import DeskScene from '../components/dashboard/DeskScene'
import FocusTimer from '../components/dashboard/FocusTimer'
import TaskList from '../components/dashboard/TaskList'
import NotesWidget from '../components/dashboard/NotesWidget'
import StatsRow from '../components/dashboard/StatsRow'
import AmbientControls from '../components/dashboard/AmbientControls'

const DEFAULT_CITY_IDS = ['nyc', 'lon', 'tok', 'syd', 'mum']

// ── Ambient audio engine ──────────────────────────────────────
let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
const audioNodes: AudioNode[] = []

function startAmbient() {
  if (audioCtx) return
  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  masterGain = audioCtx.createGain()
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime)
  masterGain.gain.linearRampToValueAtTime(0.45, audioCtx.currentTime + 2.5)
  masterGain.connect(audioCtx.destination)
  audioNodes.push(masterGain)

  const makeNoise = (gainVal: number, freq: number, Q: number, type: BiquadFilterType) => {
    const buf = audioCtx!.createBuffer(1, audioCtx!.sampleRate * 3, audioCtx!.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = audioCtx!.createBufferSource(); src.buffer = buf; src.loop = true
    const filt = audioCtx!.createBiquadFilter(); filt.type = type; filt.frequency.value = freq; filt.Q.value = Q
    const g = audioCtx!.createGain(); g.gain.value = gainVal
    src.connect(filt); filt.connect(g); g.connect(masterGain!)
    src.start()
    audioNodes.push(src, filt, g)
  }
  makeNoise(0.07, 260, 0.5, 'lowpass')
  makeNoise(0.04, 3800, 1.1, 'bandpass')

  const drones = [55, 82.5, 110]
  drones.forEach((freq, i) => {
    const osc = audioCtx!.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq
    osc.detune.value = (Math.random() - 0.5) * 6
    const g = audioCtx!.createGain(); g.gain.value = 0.016 - i * 0.004
    osc.connect(g); g.connect(masterGain!); osc.start()
    audioNodes.push(osc, g)
  })

  const schedulePing = () => {
    if (!audioCtx) return
    const delay = 1.5 + Math.random() * 5
    const freqs = [523, 659, 784, 880, 1047]
    const freq = freqs[Math.floor(Math.random() * freqs.length)]
    const t = audioCtx.currentTime + delay
    const osc = audioCtx.createOscillator(); osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, t + 0.8)
    const g = audioCtx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.035, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
    osc.connect(g); g.connect(masterGain!); osc.start(t); osc.stop(t + 1.3)
    setTimeout(schedulePing, delay * 1000)
  }
  schedulePing()
}

function stopAmbient() {
  if (!audioCtx || !masterGain) return
  masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.8)
  setTimeout(() => {
    audioNodes.forEach(n => { try { (n as any).stop?.(); n.disconnect() } catch {} })
    audioNodes.length = 0
    audioCtx?.close(); audioCtx = null; masterGain = null
  }, 2000)
}

// ── Rain audio engine ─────────────────────────────────────────
let rainCtx: AudioContext | null = null
let rainMaster: GainNode | null = null
const rainNodes: AudioNode[] = []
let rainPingActive = false

function startRainAudio() {
  if (rainCtx) return
  rainCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  rainMaster = rainCtx.createGain()
  rainMaster.gain.setValueAtTime(0, rainCtx.currentTime)
  rainMaster.gain.linearRampToValueAtTime(0.5, rainCtx.currentTime + 1.5)
  rainMaster.connect(rainCtx.destination)
  rainNodes.push(rainMaster)

  const makeNoise = (gainVal: number, freq: number, Q: number, type: BiquadFilterType) => {
    const buf = rainCtx!.createBuffer(1, rainCtx!.sampleRate * 3, rainCtx!.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = rainCtx!.createBufferSource(); src.buffer = buf; src.loop = true
    const filt = rainCtx!.createBiquadFilter(); filt.type = type; filt.frequency.value = freq; filt.Q.value = Q
    const g = rainCtx!.createGain(); g.gain.value = gainVal
    src.connect(filt); filt.connect(g); g.connect(rainMaster!)
    src.start()
    rainNodes.push(src, filt, g)
  }
  makeNoise(0.22, 4800, 1.4, 'bandpass')
  makeNoise(0.1, 280, 0.5, 'lowpass')

  rainPingActive = true
  const ping = () => {
    if (!rainPingActive || !rainCtx) return
    const delay = 0.05 + Math.random() * 0.35
    const t = rainCtx.currentTime + delay
    const freqs = [700, 900, 1100, 1500]
    const freq = freqs[Math.floor(Math.random() * freqs.length)]
    const osc = rainCtx.createOscillator(); osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, t + 0.12)
    const g = rainCtx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.012, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
    osc.connect(g); g.connect(rainMaster!); osc.start(t); osc.stop(t + 0.22)
    setTimeout(ping, delay * 1000)
  }
  ping()
}

function stopRainAudio() {
  rainPingActive = false
  if (!rainCtx || !rainMaster) return
  rainMaster.gain.linearRampToValueAtTime(0, rainCtx.currentTime + 1.2)
  setTimeout(() => {
    rainNodes.forEach(n => { try { (n as any).stop?.(); n.disconnect() } catch {} })
    rainNodes.length = 0
    rainCtx?.close(); rainCtx = null; rainMaster = null
  }, 1400)
}

// ── Dashboard ─────────────────────────────────────────────────
export default function Dashboard() {
  const [cityIds, setCityIds] = usePersistentState<string[]>('kronos-cities', DEFAULT_CITY_IDS)
  const [activeCityId, setActiveCityId] = usePersistentState<string>('kronos-active-city', 'nyc')
  const [use24h, setUse24h] = usePersistentState<boolean>('kronos-24h', false)
  const [rainActive, setRainActive] = useState(false)
  const [musicActive, setMusicActive] = useState(false)

  const cities = cityIds
    .map(id => CITY_LIBRARY.find(c => c.id === id))
    .filter((c): c is CityZone => !!c)

  const activeCity = CITY_LIBRARY.find(c => c.id === activeCityId) ?? CITY_LIBRARY[0]

  const handleReorder = (reordered: CityZone[]) => setCityIds(reordered.map(c => c.id))
  const handleAdd     = (city: CityZone) => { if (!cityIds.includes(city.id)) setCityIds(prev => [...prev, city.id]) }
  const handleRemove  = (id: string) => setCityIds(prev => prev.filter(x => x !== id))
  const handleSetActive = (city: CityZone) => setActiveCityId(city.id)

  const handleToggleRain = () => {
    if (rainActive) { stopRainAudio(); setRainActive(false) }
    else { startRainAudio(); setRainActive(true) }
  }
  const handleToggleMusic = () => {
    if (musicActive) { stopAmbient(); setMusicActive(false) }
    else { startAmbient(); setMusicActive(true) }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'#0a0b10' }}
    >
      {/* Top bar */}
      <DashboardTopBar
        activeCity={activeCity}
        use24h={use24h}
        onToggle24h={() => setUse24h(v => !v)}
      />

      {/* Main layout */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', minHeight:0 }}>

        {/* LEFT SIDEBAR — World Clocks */}
        <div style={{
          width:220, minWidth:220, flexShrink:0,
          borderRight:'1px solid rgba(255,255,255,0.04)',
          background:'rgba(10,11,16,0.95)',
          display:'flex', flexDirection:'column', overflow:'hidden',
        }}>
          <WorldClockPanel
            cities={cities}
            activeCity={activeCity}
            onReorder={handleReorder}
            onSetActive={handleSetActive}
            onAdd={handleAdd}
            onRemove={handleRemove}
            use24h={use24h}
          />
        </div>

        {/* CENTER — Desk Scene */}
        <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
          <DeskScene activeCity={activeCity} rainActive={rainActive} />

          {/* Ambient controls — floating bottom right of scene */}
          <div style={{ position:'absolute', bottom:'1rem', right:'1rem', zIndex:20 }}>
            <AmbientControls
              rainActive={rainActive}
              musicActive={musicActive}
              onToggleRain={handleToggleRain}
              onToggleMusic={handleToggleMusic}
            />
          </div>
        </div>

        {/* RIGHT PANEL — Productivity widgets */}
        <div style={{
          width:260, minWidth:260, flexShrink:0,
          borderLeft:'1px solid rgba(255,255,255,0.04)',
          background:'rgba(10,11,16,0.95)',
          display:'flex', flexDirection:'column', overflow:'hidden',
        }}>

          {/* Focus Timer */}
          <div style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', height:260, flexShrink:0 }}>
            <FocusTimer />
          </div>

          {/* Task List */}
          <div style={{ flex:1, borderBottom:'1px solid rgba(255,255,255,0.04)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
            <TaskList />
          </div>

          {/* Notes */}
          <div style={{ height:160, flexShrink:0, display:'flex', flexDirection:'column' }}>
            <NotesWidget />
          </div>
        </div>
      </div>

      {/* BOTTOM STATS */}
      <StatsRow />
    </motion.div>
  )
}
