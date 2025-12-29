'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { FaFileAlt, FaGamepad, FaGithub, FaHandsHelping, FaUser } from 'react-icons/fa';
import logoImage from '../../../../public/favicon.ico';
import config from '../../../../upstream.json';
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
        <div className='flex flex-col items-center gap-4 animate-fade-in bg-(--color-surface) rounded-xl p-6 shadow-lg border border-(--color-surface-border)'>
          <div className='relative w-32 h-32 md:w-40 md:h-40'>
            <Image src={logoImage} alt='Linux Game Logo' fill className='drop-shadow-2xl rounded-3xl' priority />
          </div>
          <div className='text-center'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-(--color-text) mb-2'>
              {t('screens.welcome.title')}
            </h1>
            <p className='text-xl md:text-2xl text-(--color-text-secondary)'>{t('screens.welcome.subtitle')}</p>
          </div>
        </div>

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
          <div className='bg-(--color-surface) rounded-xl p-6 md:p-8 shadow-lg border border-(--color-surface-border)'>
            <h2 className='text-2xl font-bold text-(--color-text) mb-4'>{t('screens.welcome.title')}</h2>
            <p className='text-gray-300 leading-relaxed text-lg'>{t('screens.welcome.description')}</p>
          </div>

          <div className='bg-(--color-surface) rounded-xl p-6 md:p-8 shadow-lg border border-(--color-surface-border)'>
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
          </div>
        </div>

        <div className='animate-bounce-in'>
          <Button.Two href='/one'>{t('screens.welcome.cta')}</Button.Two>
        </div>

        <div className='w-full max-w-4xl bg-(--color-surface) rounded-xl p-6 shadow-lg border border-(--color-surface-border)'>
          <div className='flex flex-wrap gap-3 justify-center'>
            <Button.One href={config.links.github.repository} icon={FaGithub}>
              {t('screens.welcome.links.github')}
            </Button.One>
            <Button.One href={config.links.demo} icon={FaGamepad}>
              {t('screens.welcome.links.demo')}
            </Button.One>
            <Button.One href={config.links.github.contributing} icon={FaHandsHelping}>
              {t('screens.welcome.links.contribute')}
            </Button.One>
            <Button.One href={config.links.github.authors} icon={FaUser}>
              {t('screens.welcome.links.author')}
            </Button.One>
            <Button.One href={config.links.github.license} icon={FaFileAlt}>
              {t('screens.welcome.links.license')}
            </Button.One>
          </div>
        </div>
      </div>
    </div>
  );
}
