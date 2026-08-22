import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import type {Language} from '@site/src/data/languages';
import LanguageIcon from '@site/src/components/LanguageIcon';

import styles from './styles.module.css';

type Props = {
  language: Language;
  size?: 'md' | 'lg';
};

export default function LanguageCard({
  language,
  size = 'md',
}: Props): ReactNode {
  const iconSize = size === 'lg' ? 96 : 80;
  const inner = (
    <>
      <span className={styles.iconSlot}>
        <LanguageIcon language={language} size={iconSize} />
      </span>
      <span className={styles.name}>{language.name}</span>
      <span className={styles.badgeSlot}>
        {language.status === 'coming-soon' ? (
          <span className="lang-badge-soon">
            <Translate id="languages.comingSoon">Em breve</Translate>
          </span>
        ) : null}
      </span>
    </>
  );

  if (language.status === 'available' && language.routeBasePath) {
    return (
      <Link
        className={clsx(styles.card, styles.cardAvailable)}
        to={`/${language.routeBasePath}`}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={clsx(styles.card, 'lang-card--soon')}>{inner}</div>
  );
}
