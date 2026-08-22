/** URL prefixes that must never be stacked when switching human language. */
export const LOCALE_PREFIXES = ['en', 'pt-BR', 'pt'] as const;

const PREFIX_RE = /^\/(en|pt-BR|pt)(?=\/|$)/;

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(PREFIX_RE, '');
  if (!stripped || stripped === '') {
    return '/';
  }
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

export function pathForLocale(
  pathname: string,
  targetLocale: string,
  defaultLocale: string,
): string {
  const rest = stripLocalePrefix(pathname);
  if (targetLocale === defaultLocale) {
    return rest;
  }
  const prefix = targetLocale;
  return rest === '/' ? `/${prefix}/` : `/${prefix}${rest}`;
}
