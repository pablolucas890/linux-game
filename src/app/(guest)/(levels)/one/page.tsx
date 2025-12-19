'use client';

import Button from '@/src/components/button';
import { Terminal } from '@/src/components/terminal';
import { useI18n } from '@/src/contexts/i18n';
import config from '@/upstream.json';
import { FaFileAlt, FaGamepad, FaGithub, FaHandsHelping, FaUser } from 'react-icons/fa';

export default function One() {
  const { t } = useI18n();

  const handleExecuteCommand = (command: string, directory: string, output: string) => {
    // TODO: Switch to Backend validation
    // TODO: Show a success message
    // TODO: Create interfaces

    const SUCCESS = {
      command: ['cat index.html | grep pubic -n', 'cat index.html | grep -n pubic'],
      directory: ['/var/www/html'],
      output: ['<color=green>206</color>:         <p>The new policy was discussed in a pubic meeting.</p>'],
    };

    if (
      SUCCESS.command.some(cmd => cmd.includes(command)) &&
      SUCCESS.directory.some(dir => dir === directory) &&
      SUCCESS.output.some(out => out === output)
    ) {
      console.log('Success');
    } else {
      console.log('Failed');
    }
  };

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center gap-8'>
      <div className='w-full max-w-2xl animate-slide-up text-center'>
        <h1 className='text-2xl font-bold text-(--color-text) mb-4'>{t('screens.levels.one.title')}</h1>
        <p className='text-gray-300 leading-relaxed text-lg'>{t('screens.levels.one.description')}</p>
      </div>

      <div className='w-full flex justify-center animate-slide-up'>
        <Terminal username='user' machine='linux-game' level={1} onExecuteCommand={handleExecuteCommand} />
      </div>

      <div className='w-full max-w-2xl bg-(--color-surface) rounded-xl p-6 shadow-lg border border-(--color-surface-border) animate-slide-up'>
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
  );
}
