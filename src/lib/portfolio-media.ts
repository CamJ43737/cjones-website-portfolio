import {
  imagesOnly,
  mediaByPathPrefix,
  type MediaItem,
} from "@/lib/media";

const INDUSTRY_PREFIX = "/images/05_Internships/industry/";
const COCA_COLA_PREFIX = "/images/05_Internships/coca-cola/";
const PHOTO_PREFIX = "/images/08_Photography/";
const CERT_PREFIX = "/images/04_Research/publications/certifications/";

/** Prefer the canonical internship industry folder; skip mirrored 11_Industry + *-1 copies. */
export function industryImages(): MediaItem[] {
  return imagesOnly(mediaByPathPrefix(INDUSTRY_PREFIX)).filter(
    (m) => !m.src.includes("/11_Industry/"),
  );
}

export function cocaColaImages(): MediaItem[] {
  return imagesOnly(mediaByPathPrefix(COCA_COLA_PREFIX));
}

/** All photography stills — skip graphic mockups only. */
export function photographyImages(): MediaItem[] {
  return imagesOnly(mediaByPathPrefix(PHOTO_PREFIX)).filter(
    (m) => !m.src.toLowerCase().includes("untitled-design"),
  );
}

export function certificateImages(): MediaItem[] {
  return imagesOnly(mediaByPathPrefix(CERT_PREFIX));
}

export function toGalleryItem(m: MediaItem, fit: "cover" | "contain" = "cover") {
  return {
    src: m.src,
    alt: m.originalName.replace(/[-_]/g, " ").replace(/\.\w+$/, ""),
    objectPosition: "50% 40%",
    fit,
  };
}
