export function BreakdownBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((sum, i) => sum + i.value, 0) || 1
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-900/5">
        {items.map((item) => (
          <div key={item.label} style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-ink-700/60">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}: <span className="font-medium text-ink-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
