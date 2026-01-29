// src/lib/utils/text.ts

export function toTitleCase(input: string | null | undefined): string {
  if (!input) return '';

  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
