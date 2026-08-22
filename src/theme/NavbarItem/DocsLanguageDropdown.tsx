import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {Props as DropdownNavbarItemProps} from '@theme/NavbarItem/DropdownNavbarItem';
import {
  comingSoonLanguages,
  availableLanguages,
} from '@site/src/data/languages';

const DOCS_PATH_RE =
  /^(?:\/(?:en|pt-BR|pt))?\/docs\/(js|php|python|ruby)(?:\/(.*))?$/;

function parseDocsPath(
  pathname: string,
): {slug: string; rest: string} | null {
  const m = pathname.match(DOCS_PATH_RE);
  if (!m) {
    return null;
  }
  const rest = m[2] ? `/${m[2]}`.replace(/\/$/, '') : '';
  return {slug: m[1], rest};
}

type Props = DropdownNavbarItemProps;

export default function DocsLanguageDropdown({
  mobile,
  ...props
}: Props): ReactNode {
  const {pathname} = useLocation();
  const parsed = parseDocsPath(pathname);
  const currentSlug = parsed?.slug;
  const rest = parsed?.rest ?? '';

  const currentLang = availableLanguages.find((l) => l.slug === currentSlug);

  const items: LinkLikeNavbarItemProps[] = [
    ...availableLanguages.map((language) => ({
      label: language.name,
      to: `/docs/${language.slug}${parsed ? rest : ''}`,
      isActive: () => currentSlug === language.slug,
    })),
    ...comingSoonLanguages.map((language) => ({
      type: 'html' as const,
      value: `<span class="dropdown__link dropdown__link--disabled">${language.name} · ${translate(
        {
          id: 'languages.comingSoon',
          message: 'Em breve',
        },
      )}</span>`,
    })),
  ];

  const label = currentLang
    ? currentLang.name
    : translate({id: 'navbar.language', message: 'Linguagem'});

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={label}
      items={items}
    />
  );
}
