import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import {
  availableLanguages,
  comingSoonLanguages,
} from '@site/src/data/languages';
import LanguageCard from '@site/src/components/LanguageCard';

import styles from './styles.module.css';

export default function DocsPicker(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'docsPicker.title',
        message: 'Escolha uma linguagem',
      })}
      description={translate({
        id: 'docsPicker.subtitle',
        message:
          'A documentação da BR Utils é específica por linguagem. Escolha a implementação que você usa.',
      })}>
      <main className="container margin-vert--lg">
        <Heading as="h1">
          <Translate id="docsPicker.title">Escolha uma linguagem</Translate>
        </Heading>
        <p>
          <Translate id="docsPicker.subtitle">
            A documentação da BR Utils é específica por linguagem. Escolha a
            implementação que você usa.
          </Translate>
        </p>
        <Heading as="h2">
          <Translate id="languages.available">Disponível agora</Translate>
        </Heading>
        <div className={styles.grid}>
          {availableLanguages.map((language) => (
            <LanguageCard key={language.slug} language={language} size="lg" />
          ))}
        </div>
        <Heading as="h2" className="margin-top--lg">
          <Translate id="languages.comingSoonHeading">
            Em desenvolvimento
          </Translate>
        </Heading>
        <div className={styles.grid}>
          {comingSoonLanguages.map((language) => (
            <LanguageCard key={language.slug} language={language} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
