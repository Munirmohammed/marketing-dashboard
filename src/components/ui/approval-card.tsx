'use client';

import { Check, X } from 'lucide-react';
import { Badge } from './badge';

interface ApprovalCardProps {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  status: string;
  meta?: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalCard({
  id, title, subtitle, body, status, meta, onApprove, onReject,
}: ApprovalCardProps) {
  const isPending = status === 'pending_approval';

  return (
    <div className={`card card-hover p-4.5 space-y-3 transition-all ${
      isPending ? 'border-amber-500/30 bg-amber-500/[0.02]' : ''
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm text-foreground tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <Badge status={status} />
      </div>
      <p className="text-xs sm:text-sm text-card-foreground/90 whitespace-pre-wrap line-clamp-4 leading-relaxed bg-surface-1/50 p-3 rounded-lg border border-border/40">
        {body}
      </p>
      {meta && <p className="text-[11px] font-mono text-muted-foreground/80">{meta}</p>}
      {isPending && (
        <div className="flex items-center gap-2 pt-1 border-t border-border/50">
          <button className="btn btn-success btn-sm shadow-xs" onClick={() => onApprove(id)}>
            <Check size={13} className="stroke-[2.5]" /> Approve
          </button>
          <button className="btn btn-destructive btn-sm shadow-xs" onClick={() => onReject(id)}>
            <X size={13} className="stroke-[2.5]" /> Reject
          </button>
        </div>
      )}
    </div>
  );
}
