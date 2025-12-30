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
      {
        id: 'three',
        texts: tArray('screens.levels.1.helpers.three'),
        nextStage: 'four',
      },
    ],
    [tArray],
  );

  const handleSuccessToast = () => {
    window.location.href = '/register';
  };

  return <Wrapper.Level typeWriterStages={typeWriterStages} levelId={1} onSuccessToast={handleSuccessToast} />;
}
