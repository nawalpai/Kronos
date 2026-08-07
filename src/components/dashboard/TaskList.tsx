import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { usePersistentState } from '../../lib/usePersistentState'

interface Task { id: string; text: string; done: boolean; createdAt: number }

export default function TaskList() {
  const [tasks, setTasks] = usePersistentState<Task[]>('kronos-tasks', [])
  const [input, setInput] = useState('')

  const add = () => {
    const t = input.trim()
    if (!t) return
    setTasks(prev => [...prev, { id: Date.now().toString(), text: t, done: false, createdAt: Date.now() }])
    setInput('')
  }

  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const remove = (id: string) => setTasks(prev => prev.filter(t => t.id !== id))

  const done  = tasks.filter(t => t.done).length
  const total = tasks.length
  const pct   = total > 0 ? (done / total) * 100 : 0

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', padding:'0.75rem 0.75rem 0.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
        <span style={{ fontFamily:'IBM Plex Mono', fontSize:'0.68rem', color:'#3a3748', letterSpacing:'0.12em' }}>TASKS</span>
        {total > 0 && (
          <span style={{ fontFamily:'IBM Plex Mono', fontSize:'0.65rem', color:'#5a5668' }}>{done}/{total}</span>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ height:2, background:'rgba(255,255,255,0.05)', borderRadius:2, marginBottom:'0.6rem', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'#c9a227', borderRadius:2, transition:'width 0.4s ease', boxShadow:'0 0 6px rgba(201,162,39,0.5)' }} />
        </div>
      )}

      {/* Add input */}
      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.6rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a task…"
          style={{
            flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:7, color:'#f2f0e8', fontFamily:'Inter', fontSize:'0.78rem',
            padding:'0.4rem 0.6rem', outline:'none',
          }}
        />
        <button
          onClick={add}
          style={{
            background:'rgba(201,162,39,0.12)', border:'1px solid rgba(201,162,39,0.25)',
            borderRadius:7, color:'#c9a227', fontSize:'0.85rem', padding:'0 0.6rem',
            cursor:'pointer', transition:'background 0.2s',
          }}
        >+</button>
      </div>

      {/* Task list */}
      <div style={{ flex:1, overflowY:'auto' }}>
        <Reorder.Group axis="y" values={tasks} onReorder={setTasks} style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'0.3rem' }}>
          <AnimatePresence initial={false}>
            {tasks.map(task => (
              <Reorder.Item key={task.id} value={task} style={{ listStyle:'none' }}>
                <motion.div
                  initial={{ opacity:0, y:-8 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, height:0, marginBottom:0 }}
                  style={{
                    display:'flex', alignItems:'center', gap:'0.5rem',
                    padding:'0.4rem 0.5rem', background:'rgba(255,255,255,0.02)',
                    border:'1px solid rgba(255,255,255,0.05)', borderRadius:7,
                    cursor:'pointer',
                  }}
                >
                  <button
                    onClick={() => toggle(task.id)}
                    style={{
                      width:14, height:14, borderRadius:4, flexShrink:0,
                      border:`1.5px solid ${task.done ? '#c9a227' : 'rgba(255,255,255,0.15)'}`,
                      background: task.done ? '#c9a227' : 'transparent',
                      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'0.55rem', color:'#0a0b10', transition:'all 0.2s',
                    }}
                  >{task.done ? '✓' : ''}</button>

                  <span style={{
                    flex:1, fontFamily:'Inter', fontSize:'0.78rem', lineHeight:1.4,
                    color: task.done ? '#3a3748' : '#c8c4d4',
                    textDecoration: task.done ? 'line-through' : 'none',
                    transition:'color 0.2s, text-decoration 0.2s',
                  }}>{task.text}</span>

                  <button
                    onClick={() => remove(task.id)}
                    style={{
                      background:'none', border:'none', color:'#2a2830',
                      cursor:'pointer', fontSize:'0.65rem', lineHeight:1,
                      padding:'0.15rem 0.2rem', borderRadius:4, transition:'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#2a2830')}
                  >✕</button>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {tasks.length === 0 && (
          <div style={{ textAlign:'center', color:'#2a2830', fontFamily:'Inter', fontSize:'0.75rem', marginTop:'1.5rem' }}>
            No tasks yet. Add one above.
          </div>
        )}
      </div>
    </div>
  )
}
