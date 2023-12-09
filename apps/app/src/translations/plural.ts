/**
 * Returns the singular or plural version of a string based on the count.
 * @example
 * ```typescript
 * plural(count, "{{count}} item", "{{count}} items")
 * ```
 */
export const plural = (count: number, singular: string, pluralString: string): string => {
  if (count === 1) {
    return singular.replace("{{count}}", count.toString());
  }
  return pluralString.replace("{{count}}", count.toString());
};
