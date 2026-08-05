const columns = [
  {
    heading: 'Product',
    links: ['Tasks', 'Notes', 'Calendar', 'Analytics', 'Focus mode'],
  },
  {
    heading: 'Company',
    links: ['About', 'Changelog', 'Careers'],
  },
  {
    heading: 'Resources',
    links: ['Docs', 'Support', 'Status'],
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-panel-line px-4 py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <span className="font-display text-lg font-semibold text-paper">Kronos</span>
          <p className="mt-3 max-w-[200px] text-sm text-muted">
            Time, orchestrated — for students, professionals, and developers.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.heading}>
            <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
              {col.heading}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="focus-ring rounded-md text-sm text-muted transition-colors hover:text-paper"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-panel-line pt-6 text-xs text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} Kronos. All rights reserved.</span>
        <span className="font-mono">Built around the clock.</span>
      </div>
    </footer>
  )
}
