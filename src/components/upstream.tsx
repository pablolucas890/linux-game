import { FaFileAlt, FaGamepad, FaGithub, FaHandsHelping, FaUser } from 'react-icons/fa';
import config from '../../upstream.json';
import { useI18n } from '../contexts/i18n';
import Button from './button';

export function Upstream() {
  const { t } = useI18n();

  return (
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
  );
}
