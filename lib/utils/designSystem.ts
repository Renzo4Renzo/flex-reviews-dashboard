/**
 * Shared Design System Constants
 * Following DRY principles - single source of truth for colors, spacing, and typography
 */

export const COLORS = {
  // Brand Colors
  primary: '#284E4C',
  primaryHover: '#1f3a38',

  // Background Colors
  pageBackground: '#F8F7F5',
  white: '#FFFFFF',

  // Status Colors
  success: 'green',
  warning: 'yellow',
  critical: 'red',
  neutral: 'gray',

  // Text Colors
  textPrimary: '#000',
  textDimmed: 'dimmed',
} as const;

export const SPACING = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

export const FONT_SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const BORDER_RADIUS = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export const SHADOWS = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

/**
 * Rating color thresholds
 * < 7: critical (red)
 * < 8: warning (yellow)
 * >= 8: success (green)
 */
export const RATING_THRESHOLDS = {
  critical: 7,
  warning: 8,
} as const;
