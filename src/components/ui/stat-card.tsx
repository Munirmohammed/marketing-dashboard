'use client';

import type { LucideIcon } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  sparkline?: { value: number }[];
  color?: string;
}

export function StatCard({ label, value, icon: Icon, trend, sparkline, color = 'var(--primary)' }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="card card-hover stat-glow p-4.5 relative group">
      {/* Subtle top accent highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-1.5">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">{formatNumber(value)}</p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                isPositive
                  ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/12 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {isPositive ? '↑' : '↓'} {isPositive ? '+' : ''}{trend.toFixed(1)}%
              </span>
              <span className="text-[10px] text-muted-foreground/75">vs last week</span>
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-xs"
          style={{
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${color} 24%, transparent)`,
          }}
        >
          <Icon size={19} style={{ color }} />
        </div>
      </div>
      {sparkline && sparkline.length > 1 && (
        <div className="h-10 mt-3 relative z-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${label.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${label.replace(/\s+/g, '-')})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
