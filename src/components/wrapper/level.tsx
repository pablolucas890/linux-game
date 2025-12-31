'use client';

import Input from '@/src/components/input';
import { Terminal } from '@/src/components/terminal';
import { Toast } from '@/src/components/toast';
import { TypeWriterContainer } from '@/src/components/typewriter-container';
import { useI18n } from '@/src/contexts/i18n';
import { useLevels } from '@/src/contexts/levels';
import { LevelId, TypeWriterStage, TypeWriterStageConfig } from '@/src/types/props';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';

interface LevelWrapperProps {
  typeWriterStages: TypeWriterStageConfig[];
  levelId: LevelId;
  onSuccessToast: () => void;
  initialStage?: TypeWriterStage;
}

export function Level({ typeWriterStages, levelId, onSuccessToast, initialStage = 'one' }: LevelWrapperProps) {
  const { t } = useI18n();
  const { handleStartStages, handleExecuteCommand, handleTestResult } = useLevels();

  const translationKeys = useMemo(
    () => ({
      title: `screens.levels.${levelId}.title`,
      placeholder: `screens.levels.${levelId}.placeholder`,
      next: `screens.levels.${levelId}.next`,
      successMessage: `screens.levels.${levelId}.success.message`,
      successDescription: `screens.levels.${levelId}.success.description`,
    }),
    [levelId],
  );

  const [stagesState, setStagesState] = useState<Record<TypeWriterStage, { textShown: number; finished: boolean }>>(
    () => {
      const initialState: Record<string, { textShown: number; finished: boolean }> = {};
      typeWriterStages.forEach(stage => {
        initialState[stage.id] = { textShown: 0, finished: false };
      });
      return initialState as Record<TypeWriterStage, { textShown: number; finished: boolean }>;
    },
  );
  const [currentStage, setCurrentStage] = useState<TypeWriterStage>(initialStage);
  const [inputSuccessPulse, setInputSuccessPulse] = useState<boolean>(false);
  const [inputToast, setInputToast] = useState<{ message: string; description: string; visible: boolean } | null>(null);

  const hasInitialized = useRef<boolean>(false);

  const isLastStage = useMemo(() => {
    const lastStage = typeWriterStages[typeWriterStages.length - 1];
    return lastStage ? currentStage === lastStage.nextStage : false;
  }, [currentStage, typeWriterStages]);

  const getStageSetters = (stageId: TypeWriterStage) => {
    return {
      setTextShown: (value: number | ((prev: number) => number)) => {
        setStagesState(prev => ({
          ...prev,
          [stageId]: {
            ...prev[stageId],
            textShown: typeof value === 'function' ? value(prev[stageId].textShown) : value,
          },
        }));
      },
      setFinished: (value: boolean | ((prev: boolean) => boolean)) => {
        setStagesState(prev => ({
          ...prev,
          [stageId]: {
            ...prev[stageId],
            finished: typeof value === 'function' ? value(prev[stageId].finished) : value,
          },
        }));
      },
    };
  };

  const getStageState = (stageId: TypeWriterStage) => {
    const stageState = stagesState[stageId];
    if (!stageState) {
      throw new Error(`Stage ${stageId} not found`);
    }

    const setters = getStageSetters(stageId);
    return {
      textShown: stageState.textShown,
      finished: stageState.finished,
      setTextShown: setters.setTextShown,
      setFinished: setters.setFinished,
    };
  };

  const handleInputSubmit = async (value: string) => {
    const result = await handleTestResult(levelId, value);
    if (result) {
      setInputSuccessPulse(true);
      setInputToast({
        message: t(translationKeys.successMessage),
        description: t(translationKeys.successDescription),
        visible: true,
      });
      window.setTimeout(() => setInputSuccessPulse(false), 1000);
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const { setTextShown, setFinished } = getStageSetters(initialStage);
      handleStartStages(initialStage, setTextShown, setFinished, setCurrentStage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {inputToast && (
        <Toast
          message={inputToast.message}
          description={inputToast.description}
          visible={inputToast.visible}
          nextButtonText={t(translationKeys.next)}
          nextButtonOnClick={() => {
            setInputToast(null);
            onSuccessToast();
          }}
        />
      )}

      <div
        className={clsx(
          'w-full flex flex-col items-center justify-center h-screen overflow-hidden',
          !isLastStage && 'bg-(--color-bg)',
        )}
      >
        <div className='w-full max-w-2xl animate-slide-up text-center mb-8'>
          <h1 className='text-2xl font-bold text-(--color-text) mb-4'>{t(translationKeys.title)}</h1>
        </div>

        <div className='relative w-full flex justify-center items-center'>
          {typeWriterStages.map(stage => (
            <TypeWriterContainer
              key={stage.id}
              currentStage={stage}
              stageState={getStageState(stage.id)}
              isActive={currentStage === stage.id}
              getStageState={getStageState}
              onNextStage={nextStage => {
                setCurrentStage(nextStage);
                const { setTextShown, setFinished } = getStageSetters(nextStage);
                handleStartStages(nextStage, setTextShown, setFinished);
              }}
              nextButtonTextKey={translationKeys.next}
            />
          ))}
        </div>

        <div className='relative w-full flex justify-center items-center'>
          <div
            className={clsx(
              'w-full flex justify-center items-center transition-all duration-500 ease-in-out',
              isLastStage
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0',
            )}
          >
            <Terminal
              username='user'
              machine='linux-game'
              level={levelId}
              onExecuteCommand={(...args) => handleExecuteCommand(levelId, ...args)}
            />
          </div>
        </div>

        <div
          className={clsx(
            'w-full max-w-md mt-8',
            isLastStage
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0',
          )}
        >
          <Input.One
            onSubmit={handleInputSubmit}
            successPulse={inputSuccessPulse}
            placeholder={t(translationKeys.placeholder)}
          />
        </div>
      </div>
    </>
  );
}
