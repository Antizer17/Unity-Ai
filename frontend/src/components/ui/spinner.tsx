import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div className={cn('relative', sizeMap[size], className)}>
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          'border-2 border-transparent',
          'border-t-indigo-500 border-r-violet-500',
          'animate-spin'
        )}
      />
      <div
        className={cn(
          'absolute inset-1 rounded-full',
          'border-2 border-transparent',
          'border-b-cyan-400 border-l-indigo-400',
          'animate-spin',
          '[animation-direction:reverse]',
          '[animation-duration:0.6s]'
        )}
      />
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400 animate-pulse">Loading…</p>
      </div>
    </div>
  );
}

export default Spinner;
