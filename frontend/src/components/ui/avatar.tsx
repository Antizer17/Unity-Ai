import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    'from-indigo-500 to-violet-500',
    'from-cyan-500 to-blue-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-500',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

export function Avatar({ src, name, size = 'md', className, id }: AvatarProps) {
  if (src) {
    return (
      <img
        id={id}
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-white/10',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      id={id}
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white/10',
        'bg-gradient-to-br',
        getColorFromName(name),
        sizeStyles[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export default Avatar;
