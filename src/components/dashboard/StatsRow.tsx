export default function StatsRow({
  focusMinutes,
  completedTasks,
  sessions,
  streak,
}: {
  focusMinutes: number
  completedTasks: number
  sessions: number
  streak: number
}) {
  const items = [
    { label: "Today's focus", value: `${focusMinutes}m` },
    { label: 'Completed', value: `${completedTasks}` },
    { label: 'Sessions', value: `${sessions}` },
    { label: 'Streak', value: `${streak}d` },
  ]
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="glass rounded-xl px-3 py-3 text-center">
          <div className="font-display text-xl font-semibold text-brass-bright">{it.value}</div>
          <div className="mt-0.5 text-[10px] leading-tight text-muted">{it.label}</div>
        </div>
      ))}
    </div>
  )
}
