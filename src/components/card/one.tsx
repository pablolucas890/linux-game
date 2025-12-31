'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

interface OneProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  maxWidth?: string;
  animation?: string;
  gap?: '2' | '4' | '6' | '8';
}

export function One({ children, className, padding = 'md', centered = false, maxWidth, animation, gap }: OneProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-6 md:p-8',
    xl: 'p-8 md:p-12',
  };

  const gapClasses = {
    '2': 'gap-2',
    '4': 'gap-4',
    '6': 'gap-6',
    '8': 'gap-8',
  };

  return (
    <div
      className={clsx(
        'bg-(--color-surface) rounded-xl shadow-lg border border-(--color-surface-border)',
        paddingClasses[padding],
        centered && 'flex flex-col items-center',
        gap && gapClasses[gap],
        maxWidth && `w-full ${maxWidth}`,
        animation,
        className,
      )}
    >
      {children}
    </div>
  );
}
