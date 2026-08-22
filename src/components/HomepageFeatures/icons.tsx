import type {ReactNode, SVGProps} from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function Icon({children, ...props}: IconProps): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="48"
      height="48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}>
      {children}
    </svg>
  );
}

/** Mask / format an identifier */
export function FormatIcon(): ReactNode {
  return (
    <Icon>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10h2M11 10h2M15 10h2M7 14h10" />
    </Icon>
  );
}

/** Generate a new identifier */
export function GenerateIcon(): ReactNode {
  return (
    <Icon>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

/** Validate / check */
export function ValidateIcon(): ReactNode {
  return (
    <Icon>
      <path d="M12 3 4.5 7v5c0 5 3.4 7.8 7.5 9 4.1-1.2 7.5-4 7.5-9V7L12 3z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

/** Letters + digits (alphanumeric) */
export function AlphanumericIcon(): ReactNode {
  return (
    <Icon>
      <path d="m5 17 3.5-10L12 17M6.2 13.5h5.6" />
      <path d="M17 7v10M15 17h4" />
    </Icon>
  );
}

/** Unified façade / layers */
export function UnifiedIcon(): ReactNode {
  return (
    <Icon>
      <path d="m12 3 8 4-8 4-8-4 8-4z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 16 8 4 8-4" />
    </Icon>
  );
}

/** Sliders / configurable defaults */
export function ConfigIcon(): ReactNode {
  return (
    <Icon>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </Icon>
  );
}
