import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

export default function HomepageHero(): ReactNode {
  const heroSrc = useBaseUrl('img/hero.jpg');
  const logoSrc = useBaseUrl('img/logo.png');

  return (
    <header
      className={styles.hero}
      style={{backgroundImage: `url('${heroSrc}')`}}>
      <div className={styles.overlay}>
        <div className={styles.inner}>
          <img
            src={logoSrc}
            alt="BR Utils"
            width={168}
            height={168}
            className={styles.logo}
          />
          <Heading as="h1" className={styles.title}>
            BR Utils
          </Heading>
          <p className={styles.tagline}>
            <Translate id="homepage.hero.tagline">
              Formate, gere e valide CPF e CNPJ — na linguagem que você já usa.
            </Translate>
          </p>
          <div className={styles.ctas}>
            <Link
              className="button button--primary button--lg"
              to="/docs">
              <Translate id="homepage.hero.ctaDocs">Começar</Translate>
            </Link>
            <a
              className={`button button--outline button--lg ${styles.githubCta}`}
              href="https://github.com/LacusSolutions/br-utils">
              <Translate id="homepage.hero.ctaGithub">Ver no GitHub</Translate>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
