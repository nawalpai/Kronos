export interface Goal {
  id: string
  label: string
  progress: number // 0-100
  color: string
}

export default function GoalsList({ goals, setGoals }: { goals: Goal[]; setGoals: (g: Goal[]) => void }) {
  const bump = (id: string, delta: number) => {
    setGoals(
      goals.map((g) => (g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + delta)) } : g))
    )
  }

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Daily goals
      </h3>
      <div className="space-y-3.5">
        {goals.map((g) => (
          <div key={g.id}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm text-paper">{g.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted">{g.progress}%</span>
                <button
                  onClick={() => bump(g.id, 10)}
                  className="focus-ring rounded px-1 text-xs text-muted hover:text-paper"
                  aria-label={`Increase ${g.label}`}
                >
                  +
                </button>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${g.progress}%`, background: g.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
