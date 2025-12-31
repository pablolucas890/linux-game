'use client';

import { Upstream } from '@/src/components/upstream';
import Image from 'next/image';
import logoImage from '../../../../public/favicon.ico';
import { useI18n } from '../../../contexts/i18n';

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8'>
      <div className='w-full max-w-2xl flex flex-col items-center gap-8 animate-fade-in'>
        <div className='flex flex-col items-center gap-6 bg-(--color-surface) rounded-xl p-8 md:p-12 shadow-lg border border-(--color-surface-border)'>
          <div className='relative w-32 h-32 md:w-40 md:h-40'>
            <Image src={logoImage} alt='Linux Game Logo' fill className='drop-shadow-2xl rounded-3xl' priority />
          </div>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-(--color-text) mb-4'>{t('screens.register.title')}</h1>
            <p className='text-xl md:text-2xl text-(--color-primary) mb-2'>{t('screens.register.message')}</p>
            <p className='text-lg text-(--color-text-secondary)'>{t('screens.register.subtitle')}</p>
          </div>
        </div>
        <div className='w-full max-w-4xl bg-(--color-surface) rounded-xl p-6 shadow-lg border border-(--color-surface-border)'>
          <h2 className='text-center text-xl md:text-2xl text-(--color-text) mb-4'>
            {t('screens.register.contribute')}
          </h2>
          <Upstream />
        </div>
      </div>
    </div>
  );
}
