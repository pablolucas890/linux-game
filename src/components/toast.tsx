'use client';

import Button from './button';

interface ToastProps {
  message: string;
  description: string;
  visible: boolean;
  nextButtonText: string;
  nextButtonOnClick: () => void;
}

export function Toast({ message, description, visible, nextButtonText, nextButtonOnClick }: ToastProps) {
  if (!visible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in' />
      <div className='relative bg-(--color-surface) rounded-xl p-8 shadow-2xl border border-green-500/50 max-w-md w-full mx-4 animate-bounce-in'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center'>
            <svg className='w-10 h-10 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>

          <div className='text-center'>
            <h3 className='text-xl font-bold text-(--color-text) mb-2'>{message}</h3>
            <p className='text-sm text-(--color-text-secondary)'>{description}</p>
          </div>

          <Button.Two href='#' onClick={nextButtonOnClick}>
            {nextButtonText}
          </Button.Two>
        </div>
      </div>
    </div>
  );
}
