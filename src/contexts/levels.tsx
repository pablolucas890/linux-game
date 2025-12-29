'use client';

import { Dispatch, SetStateAction, createContext, useCallback, useContext } from 'react';
import { LevelId, TypeWriterStage } from '../types/props';

interface LevelsContextValue {
  typeWriter: (e: Element) => Promise<void>;
  handleExecuteCommand: (level: LevelId, command: string, directory: string, output: string) => Promise<boolean>;
  handleStartStages: (
    stage: TypeWriterStage,
    setStage: Dispatch<SetStateAction<number>>,
    setStageFinished: Dispatch<SetStateAction<boolean>>,
    setCurrentStage?: Dispatch<SetStateAction<TypeWriterStage>>,
  ) => Promise<void>;
}

const LevelsContext = createContext<LevelsContextValue | undefined>(undefined);

export function LevelsProvider({ children }: { children: React.ReactNode }) {
  const typeWriter = useCallback(async (e: Element): Promise<void> => {
    return new Promise<void>(resolve => {
      const textoArray = e.innerHTML.split('');
      e.innerHTML = '';
      textoArray.forEach((letra, i) => {
        setTimeout(() => {
          e.innerHTML += letra;
          if (i === textoArray.length - 1) {
            resolve();
          }
        }, 75 * i);
      });
    });
  }, []);

  const handleStartStages = useCallback(
    async (
      stage: TypeWriterStage,
      setStage: Dispatch<SetStateAction<number>>,
      setStageFinished: Dispatch<SetStateAction<boolean>>,
      setCurrentStage?: Dispatch<SetStateAction<TypeWriterStage>>,
    ) => {
      setCurrentStage?.(stage);
      const elements = document.querySelectorAll(`.typewriter.stage-${stage}`);
      const elementsArray = Array.from(elements);
      if (elementsArray.length > 0) {
        (async () => {
          for (const element of elementsArray) {
            setStage(prevStage => prevStage + 1);
            await typeWriter(element);
          }
          setStageFinished(true);
        })();
      }
    },
    [typeWriter],
  );

  const handleExecuteCommand = async (
    level: LevelId,
    command: string,
    directory: string,
    output: string,
  ): Promise<boolean> => {
    const response = await fetch(`/api/levels/${level}`, {
      method: 'POST',
      body: JSON.stringify({ command, directory, output }),
    });
    const data = await response.json();
    return data.success;
  };

  return (
    <LevelsContext.Provider value={{ typeWriter, handleStartStages, handleExecuteCommand }}>
      {children}
    </LevelsContext.Provider>
  );
}

export function useLevels() {
  const context = useContext(LevelsContext);
  if (context === undefined) {
    throw new Error('useLevels must be used within a LevelsProvider');
  }
  return context;
}
