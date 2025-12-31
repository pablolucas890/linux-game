'use client';

import Card from '@/src/components/card';
import { Upstream } from '@/src/components/upstream';
import Image from 'next/image';
import logoImage from '../../../../public/favicon.ico';
import { useI18n } from '../../../contexts/i18n';

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8'>
      <div className='w-full max-w-2xl flex flex-col items-center gap-8 animate-fade-in'>
        <Card.One padding='xl' centered gap='6' className='max-w-2xl'>
          <div className='relative w-32 h-32 md:w-40 md:h-40'>
            <Image src={logoImage} alt='Linux Game Logo' fill className='drop-shadow-2xl rounded-3xl' priority />
          </div>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl font-bold text-(--color-text) mb-4'>{t('screens.register.title')}</h1>
            <p className='text-xl md:text-2xl text-(--color-primary) mb-2'>{t('screens.register.message')}</p>
            <p className='text-lg text-(--color-text-secondary)'>{t('screens.register.subtitle')}</p>
          </div>
        </Card.One>
        <Card.One maxWidth='max-w-4xl'>
          <h2 className='text-center text-xl md:text-2xl text-(--color-text) mb-4'>
            {t('screens.register.contribute')}
          </h2>
          <Upstream />
        </Card.One>
      </div>
    </div>
  );
}
