import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {translate} from '@docusaurus/Translate';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import IconLanguage from '@theme/Icon/Language';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {Props as DropdownNavbarItemProps} from '@theme/NavbarItem/DropdownNavbarItem';
import {pathForLocale} from '@site/src/utils/localePath';

import styles from './LocaleSwitcher.module.css';

type Props = DropdownNavbarItemProps;

export default function LocaleSwitcher({mobile, ...props}: Props): ReactNode {
  const {pathname, search, hash} = useLocation();
  const {
    i18n: {currentLocale, defaultLocale, locales, localeConfigs},
  } = useDocusaurusContext();

  const items: LinkLikeNavbarItemProps[] = locales.map((locale) => {
    const path = `${pathForLocale(pathname, locale, defaultLocale)}${search}${hash}`;
    const isCurrent = locale === currentLocale;
    // pathname:// forces a full document load so the other locale's HTML
    // (and not this SPA) is fetched. Client-side routing to /en would 404.
    const to = isCurrent ? path : `pathname://${path}`;
    return {
      label: localeConfigs[locale]?.label ?? locale,
      lang: localeConfigs[locale]?.htmlLang ?? locale,
      to,
      target: '_self',
      autoAddBaseUrl: false,
      className: isCurrent
        ? mobile
          ? 'menu__link--active'
          : 'dropdown__link--active'
        : '',
    };
  });

  const dropdownLabel = mobile
    ? translate({
        id: 'theme.navbar.mobileLanguageDropdown.label',
        message: 'Idiomas',
        description: 'The label for the mobile language switcher dropdown',
      })
    : (localeConfigs[currentLocale]?.label ?? currentLocale);

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={
        <>
          <IconLanguage className={styles.iconLanguage} />
          {dropdownLabel}
        </>
      }
      items={items}
    />
  );
}
