import type { Signal } from '@/types';
import { Badge } from './badge';
import { timeAgo } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  return (
    <div className="card card-hover p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {signal.type && <Badge status={signal.type} />}
          {signal.relevance && <Badge status={signal.relevance} />}
        </div>
        <span className="text-[11px] font-mono text-muted-foreground/80 whitespace-nowrap">
          {timeAgo(signal.created_at)}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{signal.summary}</p>
      <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground pt-1 border-t border-border/40">
        {signal.username && (
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-2/70 text-foreground/80">
            @{signal.username}
          </span>
        )}
        {signal.tweet_url && (
          <a
            href={signal.tweet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline ml-auto"
          >
            Source <ExternalLink size={11} />
          </a>
        )}
        {signal.action_taken && (
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            Action: {signal.action_taken}
          </span>
        )}
      </div>
    </div>
  );
}
