'use client';

import Wrapper from '@/src/components/wrapper';
import { useI18n } from '@/src/contexts/i18n';
import { TypeWriterStageConfig } from '@/src/types/props';
import { useMemo } from 'react';

export default function One() {
  const { tArray } = useI18n();

  // TODO: add more stages explaining the task and add gif
  const typeWriterStages: TypeWriterStageConfig[] = useMemo(
    () => [
      {
        id: 'one',
        texts: tArray('screens.levels.1.helpers.one'),
        nextStage: 'two',
      },
      {
        id: 'two',
        texts: tArray('screens.levels.1.helpers.two'),
        nextStage: 'three',
        gif: 'https://picsum.photos/800/400',
      },
    ],
    [tArray],
  );

  const handleInputSubmit = (value: string) => {
    // TODO: validate on backend and switch to context
    if (value === '206') {
      return true;
    }
    return false;
  };

  const handleSuccessToast = () => {
    console.log('Success toast clicked!');
    // TODO: navigate to register screen
  };

  return (
    <Wrapper.Level
      typeWriterStages={typeWriterStages}
      levelId={1}
      onInputSubmit={handleInputSubmit}
      onSuccessToast={handleSuccessToast}
    />
  );
}
