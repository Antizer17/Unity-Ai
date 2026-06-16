'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'interactive' | 'highlighted';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  noPadding?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-white/5 border border-white/10 backdrop-blur-md',
  interactive:
    'bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer',
  highlighted:
    'bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 backdrop-blur-md',
};

export function Card({
  variant = 'default',
  noPadding = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={variant === 'interactive' ? { scale: 1.02, y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'rounded-2xl',
        !noPadding && 'p-6',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn('text-lg font-semibold text-white', className)}>{children}</h3>;
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('text-sm text-slate-400 mt-1', className)}>{children}</p>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('', className)}>{children}</div>;
}

export default Card;
