import type {ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {Language} from '@site/src/data/languages';

import styles from './styles.module.css';

type Props = {
  language: Language;
  size?: number;
};

function OfficialMark({
  file,
  alt,
  size,
}: {
  file: string;
  alt: string;
  size: number;
}): ReactNode {
  const src = useBaseUrl(`img/languages/${file}`);
  const invert = file === 'rust.svg';

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={invert ? styles.invertInDark : undefined}
    />
  );
}

export default function LanguageIcon({
  language,
  size = 48,
}: Props): ReactNode {
  const icons = language.icons ?? [];

  if (icons.length === 0) {
    return null;
  }

  if (icons.length === 1) {
    return (
      <OfficialMark file={icons[0]} alt="" size={size} />
    );
  }

  const markSize = Math.round(size * 0.88);

  return (
    <span className={styles.group} aria-hidden="true">
      {icons.map((file) => (
        <OfficialMark key={file} file={file} alt="" size={markSize} />
      ))}
    </span>
  );
}
