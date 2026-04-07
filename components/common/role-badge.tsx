import type { UserRole } from '@/lib/types';

interface RoleBadgeProps {
  role: UserRole;
  isSelected?: boolean;
  onClick?: () => void;
}

export function RoleBadge({ role, isSelected = false, onClick }: RoleBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
        isSelected
          ? 'bg-primary text-white shadow-md'
          : 'bg-input text-foreground hover:bg-muted'
      }`}
    >
      {role}
    </button>
  );
}
