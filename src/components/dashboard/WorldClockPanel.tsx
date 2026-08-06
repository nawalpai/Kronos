import { useMemo, useState } from 'react'
import { Reorder } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import {
  CITY_LIBRARY,
  cityLocalDate,
  periodOf,
  formatTime,
  type CityDef,
} from '../../lib/timezones'

const PERIOD_DOT: Record<string, string> = {
  morning: 'bg-orange-300',
  afternoon: 'bg-teal',
  evening: 'bg-rose-300',
  night: 'bg-indigo-300',
}

export default function WorldClockPanel({
  now,
  cityIds,
  setCityIds,
  activeId,
  setActiveId,
  clockFormat,
}: {
  now: Date
  cityIds: string[]
  setCityIds: (ids: string[]) => void
  activeId: string
  setActiveId: (id: string) => void
  clockFormat: '12h' | '24h'
}) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const cities = useMemo(
    () => cityIds.map((id) => CITY_LIBRARY.find((c) => c.id === id)).filter(Boolean) as CityDef[],
    [cityIds]
  )

  const available = CITY_LIBRARY.filter((c) => !cityIds.includes(c.id))

  const removeCity = (id: string) => {
    if (cityIds.length <= 1) return
    const next = cityIds.filter((c) => c !== id)
    setCityIds(next)
    if (activeId === id) setActiveId(next[0])
  }

  const addCity = (id: string) => {
    setCityIds([...cityIds, id])
    setPickerOpen(false)
  }

  return (
    <aside className="glass flex h-full w-full flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          World clocks
        </h2>
        <div className="relative">
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="focus-ring flex h-6 w-6 items-center justify-center rounded-md border border-panel-line text-muted transition-colors hover:border-brass/50 hover:text-brass-bright"
            aria-label="Add city"
          >
            <Plus size={13} />
          </button>
          {pickerOpen && (
            <div className="glass absolute right-0 top-8 z-20 max-h-64 w-48 overflow-y-auto rounded-xl p-1.5">
              {available.length === 0 && (
                <p className="px-2 py-2 text-xs text-muted">All cities added</p>
              )}
              {available.map((c) => (
                <button
                  key={c.id}
                  onClick={() => addCity(c.id)}
                  className="focus-ring flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-paper transition-colors hover:bg-white/5"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={cityIds}
        onReorder={setCityIds}
        className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1"
      >
        {cities.map((c) => {
          const local = cityLocalDate(c.tz, now)
          const period = periodOf(local.getHours())
          const { time, suffix } = formatTime(local, clockFormat)
          const active = c.id === activeId
          return (
            <Reorder.Item
              key={c.id}
              value={c.id}
              onClick={() => setActiveId(c.id)}
              className={`focus-ring group cursor-pointer rounded-xl border px-3 py-2.5 transition-colors ${
                active
                  ? 'border-brass/50 bg-brass/10'
                  : 'border-transparent hover:border-panel-line hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${PERIOD_DOT[period]}`} />
                  <span className="font-display text-sm font-medium text-paper">{c.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCity(c.id)
                  }}
                  className="focus-ring rounded p-0.5 text-muted opacity-0 transition-opacity hover:text-paper group-hover:opacity-100"
                  aria-label={`Remove ${c.name}`}
                >
                  <X size={12} />
                </button>
              </div>
              <div className="mt-1 flex items-baseline gap-1.5 pl-3.5">
                <span className="font-mono text-lg tabular-nums text-paper">{time}</span>
                {suffix && <span className="font-mono text-[10px] text-muted">{suffix}</span>}
                <span className="ml-auto font-mono text-[10px] uppercase text-muted">{period}</span>
              </div>
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
    </aside>
  )
}
