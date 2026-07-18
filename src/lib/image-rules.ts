import type { MediaFit } from "@/data/media-assignments";

/**
 * Default: show the full frame (uncropped).
 * object-fit: contain + centered position.
 */
export function fitForPath(_src: string, explicit?: MediaFit): MediaFit {
  return explicit ?? "contain";
}

export function defaultObjectPosition(_src: string, explicit?: string): string {
  return explicit ?? "50% 50%";
}
