import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, X, Check } from 'lucide-react'

export interface Task {
  id: string
  text: string
  done: boolean
}

export default function TaskList({
  tasks,
  setTasks,
}: {
  tasks: Task[]
  setTasks: (t: Task[]) => void
}) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const text = draft.trim()
    if (!text) return
    setTasks([{ id: crypto.randomUUID(), text, done: false }, ...tasks])
    setDraft('')
  }

  const toggle = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const remove = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const pending = tasks.filter((t) => !t.done)
  const completed = tasks.filter((t) => t.done)

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Today's tasks
      </h3>

      <div className="mb-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a task..."
          className="focus-ring w-full rounded-lg border border-panel-line bg-white/[0.03] px-3 py-1.5 text-sm text-paper placeholder:text-muted"
        />
        <button
          onClick={add}
          className="focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brass text-ink transition-transform hover:scale-105"
          aria-label="Add task"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {pending.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]"
            >
              <button
                onClick={() => toggle(t.id)}
                className="focus-ring flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-panel-line"
                aria-label="Mark complete"
              />
              <span className="flex-1 text-sm text-paper">{t.text}</span>
              <button
                onClick={() => remove(t.id)}
                className="focus-ring rounded p-0.5 text-muted opacity-0 transition-opacity hover:text-paper group-hover:opacity-100"
                aria-label="Delete task"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
          {completed.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5"
            >
              <button
                onClick={() => toggle(t.id)}
                className="focus-ring flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal/70 text-ink"
                aria-label="Mark incomplete"
              >
                <Check size={10} />
              </button>
              <span className="flex-1 text-sm text-muted line-through">{t.text}</span>
              <button
                onClick={() => remove(t.id)}
                className="focus-ring rounded p-0.5 text-muted opacity-0 transition-opacity hover:text-paper group-hover:opacity-100"
                aria-label="Delete task"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <p className="px-2 py-3 text-sm text-muted">Nothing planned yet — add your first task.</p>
        )}
      </div>
    </div>
  )
}
