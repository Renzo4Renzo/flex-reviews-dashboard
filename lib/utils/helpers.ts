/**
 * Shared utility functions following DRY principles
 * Consolidates repeated logic for rating colors, calculations, and formatting
 */

/**
 * Gets color for a rating value
 * @param rating - Rating value (0-10)
 * @returns Mantine color string
 */
export const getRatingColor = (rating: number): string => {
  if (rating < 7) return 'red';
  if (rating < 8) return 'yellow';
  return 'green';
};

/**
 * Gets color for a status
 * @param status - Status type
 * @returns Mantine color string
 */
export const getStatusColor = (status: 'critical' | 'warning' | 'good'): string => {
  switch (status) {
    case 'critical':
      return 'red';
    case 'warning':
      return 'yellow';
    case 'good':
      return 'green';
    default:
      return 'gray';
  }
};

/**
 * Gets status icon emoji
 * @param status - Status type
 * @returns Emoji string
 */
export const getStatusIcon = (status: 'critical' | 'warning' | 'good'): string => {
  switch (status) {
    case 'critical':
      return '🔴';
    case 'warning':
      return '⚠️';
    case 'good':
      return '✅';
    default:
      return '⚪';
  }
};

/**
 * Calculates average of number array
 * @param numbers - Array of numbers
 * @returns Average rounded to 1 decimal place
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round((sum / numbers.length) * 10) / 10;
};

/**
 * Formats a category name (replaces underscores, capitalizes)
 * @param category - Category string
 * @returns Formatted category name
 */
export const formatCategoryName = (category: string): string => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Gets delta color (for trends)
 * @param delta - Delta value
 * @returns Mantine color string
 */
export const getDeltaColor = (delta: number): string => {
  if (delta > 0) return 'green';
  if (delta < 0) return 'red';
  return 'gray';
};

/**
 * Formats delta value with sign
 * @param delta - Delta value
 * @returns Formatted string with sign
 */
export const formatDelta = (delta: number): string => {
  const formatted = Math.abs(delta).toFixed(1);
  if (delta > 0) return `+${formatted}`;
  if (delta < 0) return `-${formatted}`;
  return formatted;
};
