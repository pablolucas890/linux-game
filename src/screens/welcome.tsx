'use client';

import config from '../../upstream.json';
import Button from '../components/button';
import { Terminal } from '../components/terminal';
import { useI18n } from '../contexts/i18n';

export function Welcome() {
  const { t } = useI18n();

  const description = t('screens.welcome.description');
  const descriptionLines = description.split('\n');

  return (
    <div className='w-full h-screen p-4 flex flex-col items-center gap-4'>
      <div className='flex flex-col items-center justify-center max-w-xl text-justify'>
        <h1 className='text-2xl font-bold mb-4'>{t('screens.welcome.title')}</h1>
        {descriptionLines.map((line, index) => (
          <p key={index} className='text-sm text-gray-500 mb-4'>
            {line}
          </p>
        ))}

        <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full'>
          <div className='flex flex-wrap gap-3 justify-center'>
            <Button.One href={config.links.github.repository}>{t('screens.welcome.links.github')}</Button.One>
            <Button.One href={config.links.demo}>{t('screens.welcome.links.demo')}</Button.One>
            <Button.One href={config.links.github.contributing}>{t('screens.welcome.links.contribute')}</Button.One>
            <Button.One href={config.links.github.authors}>{t('screens.welcome.links.author')}</Button.One>
            <Button.One href={config.links.github.license}>{t('screens.welcome.links.license')}</Button.One>
          </div>
        </div>
      </div>
      <Terminal username={t('common.username')} machine='linux-game' />
    </div>
  );
}
