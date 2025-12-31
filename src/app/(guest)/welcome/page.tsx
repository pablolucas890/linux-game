'use client';

import Card from '@/src/components/card';
import { Upstream } from '@/src/components/upstream';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import logoImage from '../../../../public/favicon.ico';
import Button from '../../../components/button';
import { useI18n } from '../../../contexts/i18n';

export default function Welcome() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);

  const saveGuestInfo = async () => {
    try {
      const response = await fetch('/api/ip');
      const data = await response.json();
      const ip = data.ip;
      if (!ip) {
        throw new Error('IP not found: ' + data.message);
      }
      fetch('/api/guests', {
        method: 'POST',
        body: JSON.stringify({ ip }),
      }).catch(error => {
        console.error('Error saving guest info:', error);
      });
    } catch (error) {
      console.error('Erro ao obter IP:', error);
    }
  };

  const initVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 5;
    }
  };

  useEffect(() => {
    saveGuestInfo();
    initVideo();
  }, []);

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8'>
      <div className='w-full max-w-6xl flex flex-col items-center gap-8 md:gap-12'>
        <Card.One padding='md' centered gap='4' animation='animate-fade-in'>
          <div className='relative w-32 h-32 md:w-40 md:h-40'>
            <Image src={logoImage} alt='Linux Game Logo' fill className='drop-shadow-2xl rounded-3xl' priority />
          </div>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-(--color-text) mb-2'>
              {t('screens.welcome.title')}
            </h1>
            <p className='text-xl md:text-2xl text-(--color-text-secondary)'>{t('screens.welcome.subtitle')}</p>
          </div>
        </Card.One>

        <div className='w-full max-w-4xl animate-slide-up'>
          <div className='relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-(--color-surface-border) transform hover:scale-[1.02] transition-transform duration-300'>
            <video
              ref={videoRef}
              src='/videos/terminal-linux-game.mp4'
              autoPlay
              loop
              muted
              playsInline
              className='w-full h-full object-cover'
            />
          </div>
        </div>

        <div className='w-full max-w-4xl grid md:grid-cols-2 gap-8 animate-fade-in-delay'>
          <Card.One padding='lg'>
            <h2 className='text-2xl font-bold text-(--color-text) mb-4'>{t('screens.welcome.title')}</h2>
            <p className='text-gray-300 leading-relaxed text-lg'>{t('screens.welcome.description')}</p>
          </Card.One>

          <Card.One padding='lg'>
            <h2 className='text-2xl font-bold text-(--color-text) mb-4'>{t('screens.welcome.features.title')}</h2>
            <ul className='space-y-3'>
              <li className='flex items-center gap-3 text-gray-300'>
                <span className='text-(--color-primary-light) text-xl'>✓</span>
                <span>{t('screens.welcome.features.terminal')}</span>
              </li>
              <li className='flex items-center gap-3 text-gray-300'>
                <span className='text-(--color-primary-light) text-xl'>✓</span>
                <span>{t('screens.welcome.features.filesystem')}</span>
              </li>
              <li className='flex items-center gap-3 text-gray-300'>
                <span className='text-(--color-primary-light) text-xl'>✓</span>
                <span>{t('screens.welcome.features.navigation')}</span>
              </li>
              <li className='flex items-center gap-3 text-gray-300'>
                <span className='text-(--color-primary-light) text-xl'>✓</span>
                <span>{t('screens.welcome.features.commands')}</span>
              </li>
            </ul>
          </Card.One>
        </div>

        <div className='animate-bounce-in'>
          <Button.Two href='/one'>{t('screens.welcome.cta')}</Button.Two>
        </div>

        <Card.One maxWidth='max-w-4xl'>
          <Upstream />
        </Card.One>
      </div>
    </div>
  );
}
