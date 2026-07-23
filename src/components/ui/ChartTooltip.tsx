interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="glass glass-strong"
      style={{ padding: '9px 12px', borderRadius: 10, fontSize: 12.5, minWidth: 120 }}
    >
      {label && <div style={{ fontWeight: 600, marginBottom: 4, textTransform: 'capitalize' }}>{label}</div>}
      {payload.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
          {item.color && <span style={{ width: 7, height: 7, borderRadius: 99, background: item.color, flexShrink: 0 }} />}
          <span style={{ textTransform: 'capitalize' }}>{item.name}:</span>
          <strong style={{ color: 'var(--text)' }}>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
