export type LanguageStatus = 'available' | 'coming-soon';

export type Language = {
  /** URL segment: js | php | python | ruby | java | go | rust */
  slug: string;
  /** Navbar / card title */
  name: string;
  /** Two–three letter monogram fallback */
  abbr: string;
  /** Official logo files under public/img/languages/ */
  icons: string[];
  /** Icon background (brand-ish, not official trademark artwork) */
  color: string;
  /** Icon text color */
  colorText: string;
  status: LanguageStatus;
  /** Only for status === 'available' */
  docsPluginId?: 'docs-js' | 'docs-php' | 'docs-python' | 'docs-ruby';
  /** Docs routeBasePath without leading slash, e.g. 'docs/js' */
  routeBasePath?: string;
  githubRepo?: string; // 'LacusSolutions/br-utils-js'
  localDir?: string; // '../js' relative to site root
};

export const DOCS_LANG_SLUGS = ['js', 'php', 'python', 'ruby'] as const;
export type DocsLangSlug = (typeof DOCS_LANG_SLUGS)[number];

export const languages: Language[] = [
  {
    slug: 'js',
    name: 'JavaScript / TypeScript',
    abbr: 'JS',
    icons: ['javascript.svg', 'typescript.svg'],
    color: '#F7DF1E',
    colorText: '#000000',
    status: 'available',
    docsPluginId: 'docs-js',
    routeBasePath: 'docs/js',
    githubRepo: 'LacusSolutions/br-utils-js',
    localDir: '../js',
  },
  {
    slug: 'php',
    name: 'PHP',
    abbr: 'PHP',
    icons: ['php.svg'],
    color: '#777BB4',
    colorText: '#ffffff',
    status: 'available',
    docsPluginId: 'docs-php',
    routeBasePath: 'docs/php',
    githubRepo: 'LacusSolutions/br-utils-php',
    localDir: '../php',
  },
  {
    slug: 'python',
    name: 'Python',
    abbr: 'PY',
    icons: ['python.svg'],
    color: '#3776AB',
    colorText: '#ffffff',
    status: 'available',
    docsPluginId: 'docs-python',
    routeBasePath: 'docs/python',
    githubRepo: 'LacusSolutions/br-utils-py',
    localDir: '../python',
  },
  {
    slug: 'ruby',
    name: 'Ruby',
    abbr: 'RB',
    icons: ['ruby.svg'],
    color: '#CC342D',
    colorText: '#ffffff',
    status: 'available',
    docsPluginId: 'docs-ruby',
    routeBasePath: 'docs/ruby',
    githubRepo: 'LacusSolutions/br-utils-ruby',
    localDir: '../ruby',
  },
  {
    slug: 'java',
    name: 'Java / Kotlin / Scala',
    abbr: 'JV',
    icons: ['java.svg', 'kotlin.svg', 'scala.svg'],
    color: '#E76F00',
    colorText: '#ffffff',
    status: 'coming-soon',
  },
  {
    slug: 'go',
    name: 'Go',
    abbr: 'GO',
    icons: ['go.svg'],
    color: '#00ADD8',
    colorText: '#ffffff',
    status: 'coming-soon',
  },
  {
    slug: 'rust',
    name: 'Rust',
    abbr: 'RS',
    icons: ['rust.svg'],
    color: '#DEA584',
    colorText: '#000000',
    status: 'coming-soon',
  },
];

export const availableLanguages = languages.filter(
  (l) => l.status === 'available',
);
export const comingSoonLanguages = languages.filter(
  (l) => l.status === 'coming-soon',
);
