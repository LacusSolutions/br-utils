import type * as Preset from '@docusaurus/preset-classic';
import {type Config, type PluginConfig} from '@docusaurus/types';
import {themes as prismThemes} from 'prism-react-renderer';

type DocsLang = {
  id: 'docs-js' | 'docs-php' | 'docs-python' | 'docs-ruby';
  lang: 'js' | 'php' | 'python' | 'ruby';
  repo: string;
};

function docsPlugin({id, lang, repo}: DocsLang): PluginConfig {
  return [
    '@docusaurus/plugin-content-docs',
    {
      id,
      path: `docs/${lang}`,
      routeBasePath: `docs/${lang}`,
      sidebarPath: `./sidebars/${lang}.ts`,
      editUrl: ({locale}: {locale: string}) =>
        locale === 'en'
          ? `https://github.com/${repo}/edit/main/README.md`
          : `https://github.com/${repo}/edit/main/README.pt.md`,
      showLastUpdateAuthor: false,
      showLastUpdateTime: false,
      versions: {
        current: {
          label: 'latest',
          path: '',
        },
      },
    },
  ];
}

const config: Config = {
  title: 'BR Utils',
  tagline:
    'Utilitários para manipulação de dados brasileiros, como CPF, CNPJ e outros',
  favicon: 'img/favicon.ico',
  url: 'https://br-utils.vercel.app',
  baseUrl: '/',
  staticDirectories: ['./public/'],

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en'],
    localeConfigs: {
      'pt-BR': {label: 'Português', htmlLang: 'pt-BR'},
      en: {label: 'English', htmlLang: 'en'},
    },
  },
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  clientModules: ['./src/clientModules/normalizeLocalePath.ts'],

  future: {
    v4: true,
  },

  organizationName: 'LacusSolutions',
  projectName: 'br-utils',

  presets: [
    [
      'classic',
      {
        blog: false,
        docs: false,
        theme: {
          customCss: './src/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    docsPlugin({
      id: 'docs-js',
      lang: 'js',
      repo: 'LacusSolutions/br-utils-js',
    }),
    docsPlugin({
      id: 'docs-php',
      lang: 'php',
      repo: 'LacusSolutions/br-utils-php',
    }),
    docsPlugin({
      id: 'docs-python',
      lang: 'python',
      repo: 'LacusSolutions/br-utils-py',
    }),
    docsPlugin({
      id: 'docs-ruby',
      lang: 'ruby',
      repo: 'LacusSolutions/br-utils-ruby',
    }),
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'BR Utils',
      logo: {
        alt: 'Lacus Solutions Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs',
          label: 'Documentação',
          position: 'left',
          activeBaseRegex: '/docs',
        },
        {
          type: 'custom-docsLanguageDropdown',
          position: 'right',
        },
        {
          type: 'custom-docsVersionDropdown',
          position: 'right',
        },
        {
          type: 'custom-localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/LacusSolutions/br-utils',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            {
              label: 'Documentação',
              to: '/docs',
            },
          ],
        },
        {
          title: 'GitHub',
          items: [
            {
              label: 'BR Utils (docs)',
              href: 'https://github.com/LacusSolutions/br-utils',
            },
            {
              label: 'JavaScript',
              href: 'https://github.com/LacusSolutions/br-utils-js',
            },
            {
              label: 'PHP',
              href: 'https://github.com/LacusSolutions/br-utils-php',
            },
            {
              label: 'Python',
              href: 'https://github.com/LacusSolutions/br-utils-py',
            },
            {
              label: 'Ruby',
              href: 'https://github.com/LacusSolutions/br-utils-ruby',
            },
          ],
        },
      ],
      copyright: `Lacus Solutions © ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'php',
        'python',
        'ruby',
        'bash',
        'json',
        'java',
        'go',
        'rust',
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
