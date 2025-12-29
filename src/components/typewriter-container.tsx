'use client';

import Button from '@/src/components/button';
import { TypeWriterStage, TypeWriterStageConfig } from '@/src/types/props';
import clsx from 'clsx';
import Image from 'next/image';

interface TypeWriterContainerProps {
  currentStage: TypeWriterStageConfig;
  stageState: {
    textShown: number;
    finished: boolean;
  };
  isActive: boolean;
  getStageState: (stageId: TypeWriterStage) => {
    textShown: number;
    finished: boolean;
  };
  onNextStage: (nextStage: TypeWriterStage) => void;
}

export function TypeWriterContainer({
  currentStage,
  stageState,
  isActive,
  getStageState,
  onNextStage,
}: TypeWriterContainerProps) {
  return (
    <div
      className={clsx(
        'w-full max-w-4xl transition-all duration-500 ease-in-out',
        isActive
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none absolute',
      )}
    >
      <div className='bg-(--color-surface) rounded-xl p-6 md:p-8 shadow-lg border border-(--color-surface-border) animate-fade-in'>
        <div
          className='flex flex-col gap-6 text-xl font-bold text-(--color-primary-light) font-mono *:transition-all *:duration-500 *:ease-in-out'
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {currentStage.texts.map((text, index) => {
            const isVisible = stageState.textShown >= index + 1;
            return (
              <span
                key={index}
                className={clsx(
                  `typewriter stage-${currentStage.id}`,
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
                )}
              >
                {text}
              </span>
            );
          })}
          {currentStage.gif && (
            <div
              className={clsx(
                'mb-6 w-full rounded-lg overflow-hidden flex justify-center items-center',
                getStageState(currentStage.id).finished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
              )}
            >
              <Image
                src={currentStage.gif}
                alt='Stage illustration'
                width={800}
                height={400}
                className='w-1/2 h-auto object-cover rounded-lg'
                unoptimized
              />
            </div>
          )}
          <div
            className={clsx(
              'mt-4 flex justify-center',
              stageState.finished
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-2 pointer-events-none',
            )}
          >
            <Button.Two href='#' onClick={() => onNextStage(currentStage.nextStage)}>
              Entendido!
            </Button.Two>
          </div>
        </div>
      </div>
    </div>
  );
}
