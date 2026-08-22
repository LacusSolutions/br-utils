import type {ReactNode} from 'react';
import NotFoundContent from '@theme-original/NotFound/Content';
import type {Props} from '@theme/NotFound/Content';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';

export default function NotFoundContentWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();

  const lookingForEnglish =
    pathname === '/en' || pathname.startsWith('/en/');
  const onEnglishServer = currentLocale === 'en';

  if (lookingForEnglish && !onEnglishServer) {
    return (
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <Heading as="h1">
              <Translate id="locale.devEnglishTitle">
                O site em inglês não está neste servidor
              </Translate>
            </Heading>
            <p>
              <Translate id="locale.devEnglishBody">
                O servidor de desenvolvimento (`bun run dev`) só serve o
                português. Para ver o inglês, use `bun run dev:en` (abre em
                /en/) ou `bun run build && bun run serve` para testar o
                seletor de idioma.
              </Translate>
            </p>
            <p>
              <Link to="/">
                <Translate id="locale.backToDefault">
                  Voltar ao português
                </Translate>
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <NotFoundContent {...props} />;
}
