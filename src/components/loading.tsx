'use client';

export function Loading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-(--color-bg)'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-12 h-12 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin' />
      </div>
    </div>
  );
}
