import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

import styles from './styles.module.css';

const JS_SNIPPET = `import brUtils from 'br-utils'

brUtils.cpf.format('47844241055')        // '478.442.410-55'
brUtils.cpf.generate({ format: true })
brUtils.cpf.isValid('123.456.789-09')    // true

brUtils.cnpj.format('03603568000195')    // '03.603.568/0001-95'
brUtils.cnpj.generate({ format: true })
brUtils.cnpj.isValid('98765432000198')   // true
`;

const PHP_SNIPPET = `<?php
use Lacus\\BrUtils;

$utils = new BrUtils();

$utils->cpf->format('11144477735');   // '111.444.777-35'
$utils->cpf->generate();
$utils->cpf->isValid('11144477735');  // true

$utils->cnpj->format('03603568000195'); // '03.603.568/0001-95'
$utils->cnpj->generate();
$utils->cnpj->isValid('03603568000195'); // true
`;

const PYTHON_SNIPPET = `from br_utils import br_utils

br_utils.cpf.format('11144477735')     # '111.444.777-35'
br_utils.cpf.generate()
br_utils.cpf.is_valid('11144477735')   # True

br_utils.cnpj.format('03603568000195')   # '03.603.568/0001-95'
br_utils.cnpj.generate()
br_utils.cnpj.is_valid('03603568000195') # True
`;

const RUBY_SNIPPET = `require 'br-utilities'

BrUtils.cpf.format('12345678909')           # => "123.456.789-09"
BrUtils.cpf.generate(format: true)
BrUtils.cpf.is_valid('123.456.789-09')      # => true

BrUtils.cnpj.format('03603568000195')       # => "03.603.568/0001-95"
BrUtils.cnpj.generate(format: true)
BrUtils.cnpj.is_valid('98765432000198')     # => true
`;

export default function HomepageCodeShowcase(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2" className={styles.heading}>
          <Translate id="homepage.code.heading">
            O mesmo fluxo, em qualquer linguagem
          </Translate>
        </Heading>
        <Tabs groupId="homepage-lang">
          <TabItem value="js" label="JavaScript" default>
            <CodeBlock language="ts">{JS_SNIPPET}</CodeBlock>
          </TabItem>
          <TabItem value="php" label="PHP">
            <CodeBlock language="php">{PHP_SNIPPET}</CodeBlock>
          </TabItem>
          <TabItem value="python" label="Python">
            <CodeBlock language="python">{PYTHON_SNIPPET}</CodeBlock>
          </TabItem>
          <TabItem value="ruby" label="Ruby">
            <CodeBlock language="ruby">{RUBY_SNIPPET}</CodeBlock>
          </TabItem>
        </Tabs>
      </div>
    </section>
  );
}
