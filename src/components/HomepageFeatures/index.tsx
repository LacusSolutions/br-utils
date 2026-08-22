import type {ComponentType, ReactNode} from 'react';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import {
  AlphanumericIcon,
  ConfigIcon,
  FormatIcon,
  GenerateIcon,
  UnifiedIcon,
  ValidateIcon,
} from './icons';

import styles from './styles.module.css';

const FEATURES: {
  Icon: ComponentType;
  titleId: string;
  title: string;
  bodyId: string;
  body: string;
}[] = [
  {
    Icon: FormatIcon,
    titleId: 'homepage.features.format.title',
    title: 'Formatar',
    bodyId: 'homepage.features.format.body',
    body: 'Aplique ou remova a máscara de CPF e CNPJ.',
  },
  {
    Icon: GenerateIcon,
    titleId: 'homepage.features.generate.title',
    title: 'Gerar',
    bodyId: 'homepage.features.generate.body',
    body: 'Gere identificadores válidos de CPF e CNPJ.',
  },
  {
    Icon: ValidateIcon,
    titleId: 'homepage.features.validate.title',
    title: 'Validar',
    bodyId: 'homepage.features.validate.body',
    body: 'Verifique dígitos verificadores e formato.',
  },
  {
    Icon: AlphanumericIcon,
    titleId: 'homepage.features.alnum.title',
    title: 'CNPJ alfanumérico',
    bodyId: 'homepage.features.alnum.body',
    body: 'Suporte ao novo formato alfanumérico de CNPJ (2026).',
  },
  {
    Icon: UnifiedIcon,
    titleId: 'homepage.features.unified.title',
    title: 'API unificada',
    bodyId: 'homepage.features.unified.body',
    body: 'Um pacote de fachada que reúne utilitários de CPF e CNPJ.',
  },
  {
    Icon: ConfigIcon,
    titleId: 'homepage.features.config.title',
    title: 'Padrões configuráveis',
    bodyId: 'homepage.features.config.body',
    body: 'Defina opções padrão na instância e sobrescreva por chamada.',
  },
];

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.heading}>
          <Translate id="homepage.features.heading">
            O que a BR Utils faz
          </Translate>
        </Heading>
        <div className="row">
          {FEATURES.map((feature) => (
            <div key={feature.titleId} className="col col--4 margin-bottom--lg">
              <div className={styles.card}>
                <span className={styles.mark}>
                  <feature.Icon />
                </span>
                <Heading as="h3">
                  <Translate id={feature.titleId}>{feature.title}</Translate>
                </Heading>
                <p>
                  <Translate id={feature.bodyId}>{feature.body}</Translate>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
