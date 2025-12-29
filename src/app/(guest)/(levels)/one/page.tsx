'use client';

import { Terminal } from '@/src/components/terminal';
import { TypeWriterContainer } from '@/src/components/typewriter-container';
import { useI18n } from '@/src/contexts/i18n';
import { useLevels } from '@/src/contexts/levels';
import { TypeWriterStage, TypeWriterStageConfig } from '@/src/types/props';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

const typeWriterStages: TypeWriterStageConfig[] = [
  {
    id: 'one',
    texts: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    ],
    nextStage: 'two',
  },
  {
    id: 'two',
    texts: [
      'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
      'Qui officia deserunt mollit anim id est laborum.',
    ],
    nextStage: 'three',
    gif: 'https://picsum.photos/800/400',
  },
];

export default function One() {
  const { t } = useI18n();

  const [stageOneTextShown, setStageOneTextShown] = useState<number>(0);
  const [stageOneFinished, setStageOneFinished] = useState<boolean>(false);
  const [stageTwoTextShown, setStageTwoTextShown] = useState<number>(0);
  const [stageTwoFinished, setStageTwoFinished] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<TypeWriterStage>('one');
  const hasInitialized = useRef<boolean>(false);

  const { handleStartStages, handleExecuteCommand } = useLevels();

  const getStageState = (stageId: TypeWriterStage) => {
    if (stageId === 'one') {
      return {
        textShown: stageOneTextShown,
        finished: stageOneFinished,
        setTextShown: setStageOneTextShown,
        setFinished: setStageOneFinished,
      };
    }
    return {
      textShown: stageTwoTextShown,
      finished: stageTwoFinished,
      setTextShown: setStageTwoTextShown,
      setFinished: setStageTwoFinished,
    };
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      handleStartStages('one', setStageOneTextShown, setStageOneFinished, setCurrentStage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={clsx(
        'w-full flex flex-col items-center justify-center p-4 md:p-8 h-screen overflow-hidden',
        currentStage === 'three' ? '' : 'bg-(--color-bg)',
      )}
    >
      <div className='w-full max-w-2xl animate-slide-up text-center mb-8'>
        <h1 className='text-2xl font-bold text-(--color-text) mb-4'>{t('screens.levels.one.title')}</h1>
      </div>

      <div className='relative w-full max-w-4xl'>
        {typeWriterStages.map(stage => {
          const stageState = getStageState(stage.id);
          const isActive = currentStage === stage.id;
          return (
            <TypeWriterContainer
              key={stage.id}
              currentStage={stage}
              stageState={stageState}
              isActive={isActive}
              getStageState={getStageState}
              onNextStage={nextStage => {
                setCurrentStage(nextStage);
                if (nextStage === 'two') {
                  // If is the last stage, open terminal
                  handleStartStages('two', setStageTwoTextShown, setStageTwoFinished);
                }
              }}
            />
          );
        })}
      </div>

      <div className='relative w-full flex justify-center items-center'>
        <div
          className={clsx(
            'w-full flex justify-center items-center transition-all duration-500 ease-in-out',
            currentStage === 'three'
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0',
          )}
        >
          <Terminal
            username='user'
            machine='linux-game'
            level={1}
            onExecuteCommand={(...args) => handleExecuteCommand('one', ...args)}
          />
        </div>
      </div>
    </div>
  );
}
