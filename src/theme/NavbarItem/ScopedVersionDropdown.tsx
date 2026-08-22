import type {ComponentProps, ReactNode} from 'react';
import {
  useActivePlugin,
  useVersions,
} from '@docusaurus/plugin-content-docs/client';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

type Props = ComponentProps<typeof DocsVersionDropdownNavbarItem>;

export default function ScopedVersionDropdown(props: Props): ReactNode {
  const active = useActivePlugin();
  if (!active) {
    return null;
  }
  const versions = useVersions(active.pluginId);
  if (versions.length <= 1) {
    return null;
  }
  return (
    <DocsVersionDropdownNavbarItem {...props} docsPluginId={active.pluginId} />
  );
}
