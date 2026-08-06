import { useMemo, useState } from 'react'
import ParticleField from '../components/ParticleField'
import DashboardTopBar from '../components/dashboard/DashboardTopBar'
import WorldClockPanel from '../components/dashboard/WorldClockPanel'
import DeskScene from '../components/dashboard/DeskScene'
import FocusTimer from '../components/dashboard/FocusTimer'
import TaskList, { type Task } from '../components/dashboard/TaskList'
import GoalsList, { type Goal } from '../components/dashboard/GoalsList'
import NotesWidget from '../components/dashboard/NotesWidget'
import StatsRow from '../components/dashboard/StatsRow'
import AmbientControls, { type AmbientState } from '../components/dashboard/AmbientControls'
import { useNow } from '../lib/useNow'
import { usePersistentState } from '../lib/usePersistentState'
import { CITY_LIBRARY, cityLocalDate, periodOf, formatTime, formatDate } from '../lib/timezones'

const DEFAULT_TASKS: Task[] = [
  { id: 't1', text: 'Review lecture notes', done: false },
  { id: 't2', text: 'Draft project outline', done: false },
]

const DEFAULT_GOALS: Goal[] = [
  { id: 'g1', label: 'Study', progress: 40, color: '#c9a227' },
  { id: 'g2', label: 'Coding', progress: 65, color: '#6ee7d8' },
  { id: 'g3', label: 'Reading', progress: 20, color: '#e8c05c' },
]

const DEFAULT_AMBIENT: AmbientState = {
  rain: false,
  music: false,
  wind: false,
  keySounds: false,
  clockFormat: '12h',
  particleDensity: 'medium',
}

export default function Dashboard() {
  const now = useNow()
  const [cityIds, setCityIds] = usePersistentState<string[]>('kronos.cities', [
    'sydney',
    'mumbai',
    'dubai',
    'berlin',
    'los-angeles',
    'singapore',
    'paris',
  ])
  const [activeId, setActiveId] = usePersistentState<string>('kronos.activeCity', 'sydney')
  const [tasks, setTasks] = usePersistentState<Task[]>('kronos.tasks', DEFAULT_TASKS)
  const [goals, setGoals] = usePersistentState<Goal[]>('kronos.goals', DEFAULT_GOALS)
  const [notes, setNotes] = usePersistentState<string>('kronos.notes', '')
  const [ambient, setAmbient] = usePersistentState<AmbientState>('kronos.ambient', DEFAULT_AMBIENT)
  const [sessions, setSessions] = usePersistentState<number>('kronos.sessions', 0)
  const [focusMinutes, setFocusMinutes] = usePersistentState<number>('kronos.focusMinutes', 0)
  const [streak] = useState(1)

  const activeCity = useMemo(
    () => CITY_LIBRARY.find((c) => c.id === activeId) ?? CITY_LIBRARY[0],
    [activeId]
  )
  const localDate = cityLocalDate(activeCity.tz, now)
  const period = periodOf(localDate.getHours())
  const { time, suffix } = formatTime(localDate, ambient.clockFormat)
  const date = formatDate(localDate)

  const completedTasks = tasks.filter((t) => t.done).length

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink">
      <ParticleField />
      <div className="absolute inset-0">
        <DeskScene period={period} rain={ambient.rain} />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-3 p-3 sm:p-4">
        <DashboardTopBar
          cityName={activeCity.name}
          region={activeCity.region}
          period={period}
          time={time}
          suffix={suffix}
          date={date}
        />

        <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[260px_1fr_320px]">
          <div className="hidden h-full overflow-hidden lg:block">
            <WorldClockPanel
              now={now}
              cityIds={cityIds}
              setCityIds={setCityIds}
              activeId={activeId}
              setActiveId={setActiveId}
              clockFormat={ambient.clockFormat}
            />
          </div>

          {/* center column intentionally transparent so the desk scene shows through */}
          <div className="hidden lg:block" />

          <div className="flex flex-col gap-3 overflow-y-auto pb-2 pr-0.5 lg:overflow-y-auto">
            <FocusTimer
              onSessionComplete={() => {
                setSessions((s) => s + 1)
                setFocusMinutes((m) => m + 25)
              }}
            />
            <StatsRow
              focusMinutes={focusMinutes}
              completedTasks={completedTasks}
              sessions={sessions}
              streak={streak}
            />
            <TaskList tasks={tasks} setTasks={setTasks} />
            <GoalsList goals={goals} setGoals={setGoals} />
            <NotesWidget value={notes} onChange={setNotes} />
          </div>
        </div>

        {/* mobile: world clocks below the fold */}
        <div className="lg:hidden">
          <WorldClockPanel
            now={now}
            cityIds={cityIds}
            setCityIds={setCityIds}
            activeId={activeId}
            setActiveId={setActiveId}
            clockFormat={ambient.clockFormat}
          />
        </div>
      </div>

      <AmbientControls state={ambient} setState={setAmbient} />
    </div>
  )
}
