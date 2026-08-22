import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import HomepageHero from '@site/src/components/HomepageHero';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageCodeShowcase from '@site/src/components/HomepageCodeShowcase';
import HomepageLanguages from '@site/src/components/HomepageLanguages';

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'homepage.meta.title',
        message: 'Utilitários para dados brasileiros',
      })}
      description={translate({
        id: 'homepage.meta.description',
        message:
          'CPF e CNPJ: formatar, gerar e validar — JavaScript, PHP, Python e Ruby.',
      })}>
      <HomepageHero />
      <main>
        <HomepageFeatures />
        <HomepageCodeShowcase />
        <HomepageLanguages />
      </main>
    </Layout>
  );
}
