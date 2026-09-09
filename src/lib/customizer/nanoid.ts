/**
 * Tiny, dependency-free nanoid replacement.
 * Generates a random 12-character alphanumeric ID.
 * No external dependency needed for this use case.
 */
export function nanoid(): string {
  return Math.random().toString(36).slice(2, 14).padEnd(12, "0");
}
