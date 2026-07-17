import manifest from "@/data/media-manifest.json";

export type MediaType = "image" | "video" | "pdf" | "other";

export type MediaItem = {
  category: string;
  originalName: string;
  src: string;
  type: MediaType;
};

const items = manifest as MediaItem[];

export function allMedia(): MediaItem[] {
  return items;
}

export function mediaByCategory(category: string): MediaItem[] {
  return items.filter(
    (m) =>
      m.category === category ||
      m.category.startsWith(`${category}/`) ||
      m.src.includes(`/${category}/`),
  );
}

export function mediaByPathPrefix(prefix: string): MediaItem[] {
  return items.filter((m) => m.src.startsWith(prefix));
}

export function imagesOnly(list: MediaItem[]): MediaItem[] {
  return list.filter((m) => m.type === "image");
}

export function videosOnly(list: MediaItem[]): MediaItem[] {
  return list.filter((m) => m.type === "video");
}

/** Match media whose sanitized src or original name contains any keyword. */
export function mediaSearch(
  list: MediaItem[],
  keywords: string[],
  opts?: { type?: MediaType },
): MediaItem[] {
  const keys = keywords.map((k) => k.toLowerCase());
  return list.filter((m) => {
    if (opts?.type && m.type !== opts.type) return false;
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

export function pickFeatured(list: MediaItem[], count: number, keywords: string[] = []): MediaItem[] {
  const preferred = keywords.length ? mediaSearch(list, keywords, { type: "image" }) : [];
  const rest = imagesOnly(list).filter((m) => !preferred.includes(m));
  return [...preferred, ...rest].slice(0, count);
}
