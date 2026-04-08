import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  badge?: ReactNode;
  highlight?: boolean;
}

export function StatCard({ label, value, icon, badge, highlight = false }: StatCardProps) {
  return (
    <div
      className={`bg-card text-card-foreground rounded-lg border transition-all p-6 ${
        highlight ? 'border-primary shadow-md' : 'border-border hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        {icon && <div className="text-primary text-2xl">{icon}</div>}
      </div>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {badge && <div>{badge}</div>}
      </div>
    </div>
  );
}
