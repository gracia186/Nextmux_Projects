export function Skeleton({ height = 16, width = '100%', rounded }: { height?: number; width?: string | number; rounded?: boolean }) {
  return (
    <div
      className="skeleton"
      style={{ height, width, borderRadius: rounded ? 999 : undefined }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass card">
      <Skeleton height={12} width="40%" />
      <div style={{ marginTop: 14 }}>
        <Skeleton height={26} width="60%" />
      </div>
      <div style={{ marginTop: 10 }}>
        <Skeleton height={10} width="80%" />
      </div>
    </div>
  );
}
