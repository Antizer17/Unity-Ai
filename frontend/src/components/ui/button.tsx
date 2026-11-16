'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Spinner (inline for the button) ──────────────────────────────────────────

function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-4 w-4', className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--gradient-primary)] text-slate-950 font-semibold shadow-lg shadow-[var(--glow-primary)] hover:opacity-95 hover:brightness-105 focus:ring-[var(--color-primary)] active:scale-[0.97]',
  secondary:
    'bg-[var(--color-surface)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--border-color)] active:scale-[0.97]',
  outline:
    'border border-[var(--color-primary)]/40 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)] focus:ring-[var(--color-primary)] active:scale-[0.97]',
  ghost:
    'text-[var(--text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--text-primary)] focus:ring-[var(--color-surface)] active:scale-[0.97]',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 focus:ring-red-500 active:scale-[0.97]',
  accent:
    'bg-[var(--gradient-accent)] text-slate-950 font-semibold shadow-lg shadow-[var(--glow-accent)] hover:opacity-95 hover:brightness-105 focus:ring-[var(--color-accent)] active:scale-[0.97]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
  icon: 'h-9 w-9 p-0 flex items-center justify-center',
};

// ─── Component ────────────────────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? <ButtonSpinner /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
export default Button;
