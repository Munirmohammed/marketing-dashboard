'use client';

import {
  Activity, Search, Sun, Moon, Radio, PenLine, Mail, Users, LogOut,
  Bell, Eye, EyeOff, Check, CheckCheck,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/store';
import { useSmartPoll } from '@/hooks/use-smart-poll';
import { timeAgo } from '@/lib/utils';
import type { Notification } from '@/types';

interface HeaderStats {
  posts_today: number;
  emails_sent: number;
  pipeline_count: number;
}

export function HeaderBar() {
  const { feedOpen, toggleFeed, realOnly, toggleRealOnly } = useDashboard();

  // Lightweight poll for header stats
  const { data: stats } = useSmartPoll<HeaderStats>(
    () => fetch(`/api/overview${realOnly ? '?real=true' : ''}`).then(r => r.json()).then(d => d.stats),
    { interval: 60_000, key: realOnly },
  );

  return (
    <header className="fixed top-0 left-0 right-0 h-[var(--header-height)] bg-card/85 backdrop-blur-xl border-b border-border/80 flex items-center justify-between px-3.5 sm:px-5 z-50 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-7.5 h-7.5 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/25 flex items-center justify-center ring-1 ring-white/20">
          <span className="text-white font-bold text-xs tracking-tight">H</span>
        </div>
        <span className="font-semibold text-sm tracking-tight text-foreground">Hermes</span>

        {/* Quick stats — hidden on small screens */}
        {stats && (
          <div className="hidden lg:flex items-center gap-2 ml-3 pl-3 border-l border-border/60">
            <QuickStat icon={PenLine} value={stats.posts_today} label="posts" />
            <QuickStat icon={Mail} value={stats.emails_sent} label="sent" />
            <QuickStat icon={Users} value={stats.pipeline_count} label="pipeline" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        <SeedToggle active={realOnly} onToggle={toggleRealOnly} />
        <SearchTrigger />
        <NotificationBell />
        <ThemeToggle />
        <FeedToggle open={feedOpen} onToggle={toggleFeed} />
        <SyncStatus />
        <LogoutButton />
      </div>
    </header>
  );
}

function QuickStat({ icon: Icon, value, label }: { icon: typeof PenLine; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-1/80 border border-border/50 text-[11px] text-muted-foreground shadow-2xs">
      <Icon size={12} className="text-primary/80" />
      <span className="font-mono font-semibold text-foreground">{value}</span>
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}

function SeedToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      className={`h-8 flex items-center gap-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
        active
          ? 'bg-success/15 text-success border border-success/30 shadow-xs'
          : 'bg-surface-1/90 text-muted-foreground hover:text-foreground hover:bg-surface-2 border border-border/70 shadow-2xs'
      }`}
      onClick={onToggle}
      title={active ? 'Showing real data only' : 'Showing all data (including seeded)'}
    >
      {active ? <Eye size={13} className="text-success" /> : <EyeOff size={13} />}
      <span className="hidden sm:inline">{active ? 'Real Only' : 'All Data'}</span>
    </button>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const realOnly = useDashboard(s => s.realOnly);

  const { data: notifications, refetch } = useSmartPoll<Notification[]>(
    () => fetch(`/api/notifications?limit=20${realOnly ? '&real=true' : ''}`).then(r => r.json()),
    { interval: 30_000, key: realOnly },
  );

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function markRead(id: number) {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    refetch();
  }

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mark_all_read: true }),
    });
    refetch();
  }

  const SEVERITY_COLORS = {
    info: 'text-primary',
    warning: 'text-warning',
    error: 'text-destructive',
  };

  return (
    <div className="relative" ref={ref}>
      <button
      className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors relative ${
        open ? 'bg-primary/15 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      }`}
        onClick={() => setOpen(!open)}
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold rounded-full count-badge flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 card glass-strong border border-border/80 shadow-xl max-h-96 overflow-hidden flex flex-col animate-slide-in z-50 rounded-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-surface-1/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-border/30">
            {(!notifications || notifications.length === 0) ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <Bell size={24} className="mx-auto mb-2 opacity-30 text-muted-foreground" />
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`px-4 py-3 hover:bg-surface-2/60 transition-colors ${
                    !n.read ? 'bg-primary/6' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 p-1 rounded-md bg-surface-2 ${SEVERITY_COLORS[n.severity] || 'text-muted-foreground'}`}>
                      <Bell size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {n.title && (
                        <div className="text-xs font-semibold truncate text-foreground">{n.title}</div>
                      )}
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{n.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-muted-foreground/75 font-mono">{timeAgo(n.created_at)}</span>
                        {!n.read && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="text-[10px] font-medium text-primary hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
                          >
                            <Check size={11} /> Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchTrigger() {
  return (
    <button
      className="hidden md:flex items-center gap-2.5 h-8 px-3 rounded-lg bg-surface-1/90 hover:bg-surface-2 border border-border/80 text-xs text-muted-foreground transition-all shadow-2xs cursor-pointer"
      onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
    >
      <Search size={13} className="text-muted-foreground/80" />
      <span className="hidden sm:inline font-medium">Search...</span>
      <kbd className="hidden sm:inline text-[10px] font-mono bg-surface-2 text-muted-foreground border border-border/60 px-1.5 py-0.5 rounded shadow-3xs ml-1">⌘K</kbd>
    </button>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    <button
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-2 border border-transparent hover:border-border/60 transition-all text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {currentTheme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-700" />}
    </button>
  );
}

function FeedToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
        open
          ? 'bg-primary/15 text-primary border border-primary/30 shadow-xs'
          : 'hover:bg-surface-2 border border-transparent hover:border-border/60 text-muted-foreground hover:text-foreground shadow-2xs'
      }`}
      onClick={onToggle}
      title="Toggle live feed"
    >
      <Radio size={15} />
    </button>
  );
}

function SyncStatus() {
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <div className="w-2 h-2 rounded-full bg-success pulse-dot" />
      <Activity size={12} />
      <span className="font-mono">{lastSync}</span>
    </div>
  );
}

function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
      onClick={handleLogout}
      disabled={loading}
      title="Sign out"
    >
      <LogOut size={15} />
    </button>
  );
}
