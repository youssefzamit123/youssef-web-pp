import type { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const riskColors: Record<RiskLevel, { bg: string; text: string; dot: string }> = {
  'Élevé': {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  'Modéré': {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  'Faible': {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    dot: 'bg-green-500',
  },
};

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const colors = riskColors[level];
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className={`${colors.bg} ${sizeClasses[size]} rounded-full flex items-center gap-2 font-medium ${colors.text}`}>
      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
      {level}
    </div>
  );
}
