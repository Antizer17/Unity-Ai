import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'processing' | 'default';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/25',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-[var(--color-secondary)]/25',
  processing: 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/30 animate-pulse',
  default: 'bg-white/5 text-[var(--text-muted)] border-[var(--border-color)]',
};

export function Badge({ variant = 'default', children, className, id }: BadgeProps) {
  return (
    <span
      id={id}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {variant === 'processing' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
        </span>
      )}
      {children}
    </span>
  );
}

export default Badge;
