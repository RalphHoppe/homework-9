export type ClassValue = string | false | null | undefined;

/** Joins class names, dropping the empty ones (e.g. conditional states). */
export function cx(...values: ClassValue[]): string {
  return values.filter((value): value is string => Boolean(value)).join(' ');
}
