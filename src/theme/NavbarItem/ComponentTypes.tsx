import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import DocsLanguageDropdown from './DocsLanguageDropdown';
import ScopedVersionDropdown from './ScopedVersionDropdown';
import LocaleSwitcher from './LocaleSwitcher';

export default {
  ...ComponentTypes,
  'custom-docsLanguageDropdown': DocsLanguageDropdown,
  'custom-docsVersionDropdown': ScopedVersionDropdown,
  'custom-localeDropdown': LocaleSwitcher,
};
