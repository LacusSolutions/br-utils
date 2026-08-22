import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {transformReadme} from './transform-readme.mjs';

const SITE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const LANGS = [
  {
    slug: 'js',
    pluginId: 'docs-js',
    localDir: path.join(SITE_ROOT, '../js'),
    githubRepo: 'LacusSolutions/br-utils-js',
    branch: 'main',
  },
  {
    slug: 'php',
    pluginId: 'docs-php',
    localDir: path.join(SITE_ROOT, '../php'),
    githubRepo: 'LacusSolutions/br-utils-php',
    branch: 'main',
  },
  {
    slug: 'python',
    pluginId: 'docs-python',
    localDir: path.join(SITE_ROOT, '../python'),
    githubRepo: 'LacusSolutions/br-utils-py',
    branch: 'main',
  },
  {
    slug: 'ruby',
    pluginId: 'docs-ruby',
    localDir: path.join(SITE_ROOT, '../ruby'),
    githubRepo: 'LacusSolutions/br-utils-ruby',
    branch: 'main',
  },
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readReadme(lang, filename) {
  const localPath = path.join(lang.localDir, filename);
  if (await fileExists(localPath)) {
    console.log(`${lang.slug} ${filename} ← local ${path.relative(SITE_ROOT, localPath)}`);
    return fs.readFile(localPath, 'utf8');
  }

  const url = `https://raw.githubusercontent.com/${lang.githubRepo}/${lang.branch}/${filename}`;
  console.log(`${lang.slug} ${filename} ← GitHub`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${res.status} ${res.statusText}`,
    );
  }
  return res.text();
}

async function writeFile(dest, contents) {
  await fs.mkdir(path.dirname(dest), {recursive: true});
  await fs.writeFile(dest, contents, 'utf8');
  console.log(`wrote ${path.relative(SITE_ROOT, dest)} (${contents.length} bytes)`);
}

async function syncLang(lang) {
  const ptSource = await readReadme(lang, 'README.pt.md');
  const enSource = await readReadme(lang, 'README.md');

  const ptOut = transformReadme(ptSource, {
    githubRepo: lang.githubRepo,
    branch: lang.branch,
    locale: 'pt-BR',
  });
  const enOut = transformReadme(enSource, {
    githubRepo: lang.githubRepo,
    branch: lang.branch,
    locale: 'en',
  });

  await writeFile(
    path.join(SITE_ROOT, `docs/${lang.slug}/getting-started.md`),
    ptOut,
  );
  await writeFile(
    path.join(
      SITE_ROOT,
      `i18n/en/docusaurus-plugin-content-docs-${lang.pluginId}/current/getting-started.md`,
    ),
    enOut,
  );
}

async function main() {
  for (const lang of LANGS) {
    await syncLang(lang);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
