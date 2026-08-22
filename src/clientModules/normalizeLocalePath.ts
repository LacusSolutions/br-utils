import {stripLocalePrefix} from '@site/src/utils/localePath';

/**
 * Portuguese is the default locale and lives at `/`, not `/pt` or `/pt-BR`.
 * Send those aliases to the real unprefixed URL so the dropdown never 404s.
 */
function normalize(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const {pathname, search, hash} = window.location;
  if (!/^\/(pt-BR|pt)(?=\/|$)/.test(pathname)) {
    return;
  }
  const rest = stripLocalePrefix(pathname);
  window.location.replace(`${rest}${search}${hash}`);
}

normalize();

export function onRouteDidUpdate({
  location,
}: {
  location: {pathname: string};
}): void {
  if (/^\/(pt-BR|pt)(?=\/|$)/.test(location.pathname)) {
    normalize();
  }
}
