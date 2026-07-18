import type { MediaFit } from "@/data/media-assignments";

/**
 * Consistent image display rules for the portfolio.
 * - posters / screens / seals / still-life camera → contain (full subject)
 * - portraits / campus / field / people → cover + object-position
 */
export function fitForPath(src: string, explicit?: MediaFit): MediaFit {
  if (explicit) return explicit;
  const s = src.toLowerCase();

  if (
    s.includes("poster") ||
    s.includes("screenshot") ||
    s.includes("seal") ||
    s.includes("pin") ||
    s.includes("certificate") ||
    s.includes("behind-the-lens")
  ) {
    return "contain";
  }

  return "cover";
}

export function defaultObjectPosition(src: string, explicit?: string): string {
  if (explicit) return explicit;
  const s = src.toLowerCase();
  if (s.includes("headshot") || s.includes("portrait") || s.includes("cameron")) {
    return "50% 20%";
  }
  if (s.includes("poster") || s.includes("screenshot")) {
    return "50% 50%";
  }
  return "50% 35%";
}
