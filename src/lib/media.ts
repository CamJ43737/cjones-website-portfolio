import manifest from "@/data/media-manifest.json";

export type MediaType = "image" | "video" | "pdf" | "other";

export type MediaItem = {
  category: string;
  originalName: string;
  src: string;
  type: MediaType;
};

const items = manifest as MediaItem[];

/** Strip mirrored "-1" copies created when Industry was dual-copied. */
function canonicalKey(src: string): string {
  return src.replace(/-1(?=\.[^.]+$)/i, "");
}

export function isDuplicateCopy(src: string): boolean {
  return /-1\.[^.]+$/i.test(src);
}

export function dedupeMedia(list: MediaItem[]): MediaItem[] {
  const seen = new Map<string, MediaItem>();
  for (const m of list) {
    const key = `${m.type}:${canonicalKey(m.src)}`;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, m);
      continue;
    }
    // Prefer the non -1 path
    if (isDuplicateCopy(existing.src) && !isDuplicateCopy(m.src)) {
      seen.set(key, m);
    }
  }
  return Array.from(seen.values());
}

export function allMedia(): MediaItem[] {
  return dedupeMedia(items);
}

export function mediaByCategory(category: string): MediaItem[] {
  return dedupeMedia(
    items.filter(
      (m) =>
        m.category === category ||
        m.category.startsWith(`${category}/`) ||
        m.src.includes(`/${category}/`),
    ),
  );
}

export function mediaByPathPrefix(prefix: string): MediaItem[] {
  return dedupeMedia(items.filter((m) => m.src.startsWith(prefix)));
}

export function imagesOnly(list: MediaItem[]): MediaItem[] {
  return list.filter((m) => m.type === "image" && !isDuplicateCopy(m.src));
}

export function videosOnly(list: MediaItem[]): MediaItem[] {
  return list.filter((m) => m.type === "video");
}

export function mediaSearch(
  list: MediaItem[],
  keywords: string[],
  opts?: { type?: MediaType },
): MediaItem[] {
  const keys = keywords.map((k) => k.toLowerCase());
  return list.filter((m) => {
    if (opts?.type && m.type !== opts.type) return false;
    if (isDuplicateCopy(m.src)) return false;
    const hay = `${m.src} ${m.originalName}`.toLowerCase();
    return keys.some((k) => hay.includes(k));
  });
}

export function firstMatch(
  list: MediaItem[],
  keywords: string[],
  opts?: { type?: MediaType },
): MediaItem | undefined {
  return mediaSearch(list, keywords, opts)[0];
}

export function pickFeatured(
  list: MediaItem[],
  count: number,
  keywords: string[] = [],
): MediaItem[] {
  const preferred = keywords.length ? mediaSearch(list, keywords, { type: "image" }) : [];
  const rest = imagesOnly(list).filter((m) => !preferred.some((p) => p.src === m.src));
  return [...preferred, ...rest].slice(0, count);
}
