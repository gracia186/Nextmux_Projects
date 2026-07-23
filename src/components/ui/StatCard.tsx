import type { ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  trend?: { value: string; direction: 'up' | 'down' };
  index?: number;
}

export function StatCard({ label, value, icon, trend, index }: StatCardProps) {
  return (
    <Card className="stat-card" hover index={index}>
      <div className="stat-card-top">
        <span className="stat-icon">{icon}</span>
        {trend && (
          <span className={`stat-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </Card>
  );
}
