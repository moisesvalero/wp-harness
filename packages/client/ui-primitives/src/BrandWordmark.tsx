import type { IconProps } from './icons/props.ts'

/** Display options for the official brand wordmark. */
export interface BrandWordmarkProps extends IconProps {
  /** Whether to include the leading whale mark; defaults to true. */
  includeMark?: boolean | undefined
}

/**
 * Render the full brand wordmark.
 * @param props.size - height in px (default 24; width follows the selected artwork).
 * @param props.className - extra class for layout placement.
 * @param props.includeMark - whether to include the leading whale mark.
 * @returns the wordmark svg (aria-hidden decorative brand art).
 */
export function BrandWordmark({ size = 24, className, includeMark = true }: BrandWordmarkProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: includeMark ? '6px' : '0px',
        fontWeight: 700,
        fontSize: `${Math.round((size * 15) / 24)}px`,
        letterSpacing: '-0.3px',
        color: 'inherit',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      WP Forge
    </span>
  )
}
