import type * as Preset from '@docusaurus/preset-classic';
import { type Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'BR Utils',
  tagline: 'Utilitários para manipulação de dados brasileiros, como CPF, CNPJ e outros',
  favicon: 'img/favicon.ico',
  url: 'https://br-utils.vercel.app',
  baseUrl: '/',
  staticDirectories: ['./public/'],

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['en', 'pt-BR'],
  },
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true,
  },

  // GitHub pages deployment config.
  organizationName: 'LacusSolutions',
  projectName: 'br-utils',

  presets: [
    [
      'classic',
      {
        blog: false,
        docs: {
          path: './src/docs/',
          routeBasePath: '/',
          sidebarPath: './src/sidebars.ts',
          editUrl: 'https://github.com/LacusSolutions/br-utils/tree/main/src/docs',
        },
        theme: {
          customCss: './src/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.jpg',
    navbar: {
      title: 'BR Utils',
      logo: {
        alt: 'Lacus Solutions Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          position: 'left',
          type: 'docSidebar',
          label: 'Tutorial',
          sidebarId: 'tutorialSidebar',
        },
        {
          position: 'right',
          label: 'GitHub',
          href: 'https://github.com/LacusSolutions',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'GitHub',
          items: [
            {
              label: 'GitHub',
              to: 'https://github.com/LacusSolutions',
            },
          ],
        },
      ],
      copyright: `Lacus Solutions © ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
