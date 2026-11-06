import { type ClassValue, clsx } from 'clsx';

// Simple clsx implementation (no external dep needed)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(date: string | null): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    });
  } catch {
    return date;
  }
}

export function formatDateTime(date: string | null): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return date;
  }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function timeAgo(date: string | null): string {
  if (!date) return '—';
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const PILLAR_LABELS: Record<number, string> = {
  1: 'AI Dev Insights',
  2: 'Open Source',
  3: 'Build in Public',
  4: 'Founder Lessons',
  5: 'Tech Tutorials',
};

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-zinc-500/12 text-zinc-700 dark:text-zinc-300 border-zinc-500/25',
  pending_approval: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25',
  ready: 'bg-blue-500/12 text-blue-700 dark:text-blue-400 border-blue-500/25',
  published: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  rejected: 'bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-500/25',
  new: 'bg-zinc-500/12 text-zinc-700 dark:text-zinc-300 border-zinc-500/25',
  validated: 'bg-blue-500/12 text-blue-700 dark:text-blue-400 border-blue-500/25',
  contacted: 'bg-indigo-500/12 text-indigo-700 dark:text-indigo-400 border-indigo-500/25',
  replied: 'bg-purple-500/12 text-purple-700 dark:text-purple-400 border-purple-500/25',
  interested: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25',
  booked: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  qualified: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  disqualified: 'bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-500/25',
  queued: 'bg-zinc-500/12 text-zinc-700 dark:text-zinc-300 border-zinc-500/25',
  approved: 'bg-blue-500/12 text-blue-700 dark:text-blue-400 border-blue-500/25',
  sent: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  cancelled: 'bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-500/25',
  pending: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25',
  proposed: 'bg-zinc-500/12 text-zinc-700 dark:text-zinc-300 border-zinc-500/25',
  running: 'bg-blue-500/12 text-blue-700 dark:text-blue-400 border-blue-500/25',
  completed: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  SCALE: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  ITERATE: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25',
  KILL: 'bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-500/25',
  high: 'bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-500/25',
  medium: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25',
  low: 'bg-zinc-500/12 text-zinc-700 dark:text-zinc-300 border-zinc-500/25',
  pain: 'bg-rose-500/12 text-rose-700 dark:text-rose-400 border-rose-500/25',
  hiring: 'bg-blue-500/12 text-blue-700 dark:text-blue-400 border-blue-500/25',
  launch: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  competitor: 'bg-purple-500/12 text-purple-700 dark:text-purple-400 border-purple-500/25',
  brand_mention: 'bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25',
  opportunity: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
};
