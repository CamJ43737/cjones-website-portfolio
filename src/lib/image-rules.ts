import type { MediaFit } from "@/data/media-assignments";

/**
 * Consistent image display rules for the portfolio.
 * Prefer contain whenever faces, people, posters, or certificates could be clipped.
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
    s.includes("certifications") ||
    s.includes("behind-the-lens") ||
    s.includes("photographer") ||
    s.includes("hackathon-winners") ||
    s.includes("team") ||
    s.includes("cohort") ||
    s.includes("family") ||
    s.includes("twin") ||
    s.includes("sibling") ||
    s.includes("sister") ||
    s.includes("group") ||
    s.includes("demo") ||
    s.includes("presentation") ||
    s.includes("meeting") ||
    s.includes("workshop") ||
    s.includes("symposium")
  ) {
    return "contain";
  }

  return "cover";
}

export function defaultObjectPosition(src: string, explicit?: string): string {
  if (explicit) return explicit;
  const s = src.toLowerCase();
  if (s.includes("headshot") || s.includes("portrait")) {
    return "50% 18%";
  }
  if (
    s.includes("poster") ||
    s.includes("screenshot") ||
    s.includes("certificate") ||
    s.includes("contain")
  ) {
    return "50% 50%";
  }
  return "50% 40%";
}
