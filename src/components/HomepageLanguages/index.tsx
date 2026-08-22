import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import {
  availableLanguages,
  comingSoonLanguages,
} from '@site/src/data/languages';
import LanguageCard from '@site/src/components/LanguageCard';

import styles from './styles.module.css';

export default function HomepageLanguages(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.heading}>
          <Translate id="languages.available">Disponível agora</Translate>
        </Heading>
        <p className={styles.lead}>
          <Translate id="homepage.languages.lead">
            Quatro linguagens prontas para produção. Java, Go e Rust estão a
            caminho.
          </Translate>
        </p>
        <div className={styles.grid}>
          {availableLanguages.map((language) => (
            <LanguageCard key={language.slug} language={language} />
          ))}
        </div>
        <Heading as="h2" className={styles.heading}>
          <Translate id="languages.comingSoonHeading">
            Em desenvolvimento
          </Translate>
        </Heading>
        <div className={styles.grid}>
          {comingSoonLanguages.map((language) => (
            <LanguageCard key={language.slug} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}
