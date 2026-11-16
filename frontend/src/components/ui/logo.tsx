'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
  priority?: boolean;
}

export function Logo({
  className,
  size = 36,
  variant = 'auto',
  priority = false,
}: LogoProps) {
  if (variant === 'light') {
    return (
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105',
          className
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="Unity-AI Graduation Bird Logo"
          width={size * 2}
          height={size * 2}
          priority={priority}
          className="w-full h-full object-contain select-none"
        />
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div
        className={cn(
          'relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105',
          className
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo-dark.png"
          alt="Unity-AI Graduation Bird Logo"
          width={size * 2}
          height={size * 2}
          priority={priority}
          className="w-full h-full object-contain select-none drop-shadow-[0_0_6px_var(--glow-primary)]"
        />
      </div>
    );
  }

  // Auto: shows light version on light surfaces, luminous dark version on dark surfaces
  return (
    <div
      className={cn(
        'relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Unity-AI Graduation Bird Logo"
        width={size * 2}
        height={size * 2}
        priority={priority}
        className="w-full h-full object-contain select-none dark:hidden"
      />
      <Image
        src="/logo-dark.png"
        alt="Unity-AI Graduation Bird Logo"
        width={size * 2}
        height={size * 2}
        priority={priority}
        className="w-full h-full object-contain select-none hidden dark:block drop-shadow-[0_0_6px_var(--glow-primary)]"
      />
    </div>
  );
}
