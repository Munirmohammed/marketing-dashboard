import { STATUS_COLORS } from '@/lib/utils';

interface BadgeProps {
  status: string;
  className?: string;
}

export function Badge({ status, className = '', showDot = true }: BadgeProps & { showDot?: boolean }) {
  const color = STATUS_COLORS[status] || 'bg-zinc-500/12 text-zinc-700 dark:text-zinc-300 border-zinc-500/25';
  return (
    <span className={`badge border shadow-2xs font-semibold ${color} ${className}`}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />}
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
}
