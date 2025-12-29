'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface OneProps {
  onSubmit: (value: string) => void;
  placeholder: string;
  className?: string;
  successPulse?: boolean;
}

export function One({ onSubmit, placeholder, className, successPulse = false }: OneProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <div className={clsx('relative', className)}>
      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={clsx(
          'w-full px-4 py-3 bg-(--color-surface) border rounded-lg text-(--color-text) outline-none transition-all duration-200',
          'focus:border-(--color-primary) focus:ring-2 focus:ring-green-500/20',
          successPulse && 'border-green-500 border-2 terminal-success-pulse',
          !successPulse && 'border-(--color-surface-border)',
        )}
      />
    </div>
  );
}
