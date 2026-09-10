/**
 * VinilArt Sport — App-level configuration.
 *
 * VINILART_MAIN_URL: URL of the main VinilArt site.
 * Set VITE_VINILART_MAIN_URL in your .env file.
 * Falls back to "#" if not configured — never invents a real URL.
 */
export const VINILART_MAIN_URL: string =
  (typeof import.meta !== "undefined" &&
   (import.meta as unknown as { env?: Record<string, string> }).env?.["VITE_VINILART_MAIN_URL"]) ||
  "#";
