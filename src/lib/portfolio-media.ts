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

function photoPriority(src: string): number {
  const s = src.toLowerCase();
  if (s.includes("cameron-the-photographer")) return 0;
  if (s.includes("behind-the-lens")) return 1;
  if (s.includes("reflections-of-tuskegee")) return 2;
  if (s.includes("roots-of-progress")) return 3;
  return 10;
}

/** All photography stills — skip graphic mockups; photographer frames first. */
export function photographyImages(): MediaItem[] {
  return imagesOnly(mediaByPathPrefix(PHOTO_PREFIX))
    .filter((m) => !m.src.toLowerCase().includes("untitled-design"))
    .sort((a, b) => {
      const d = photoPriority(a.src) - photoPriority(b.src);
      return d !== 0 ? d : a.src.localeCompare(b.src);
    });
}

export function certificateImages(): MediaItem[] {
  return imagesOnly(mediaByPathPrefix(CERT_PREFIX));
}

/** Best three PC build frames for teasers (unique, evenly spaced layouts). */
export const featuredPcBuildImages = [
  {
    src: "/images/12_PC_Build/img-2727.jpeg",
    alt: "Pyramid PC build",
    fit: "contain" as const,
    objectPosition: "50% 45%",
  },
  {
    src: "/images/12_PC_Build/img-2730.jpg",
    alt: "Custom dual-chamber PC build",
    fit: "contain" as const,
    objectPosition: "50% 50%",
  },
  {
    src: "/images/12_PC_Build/img-2713.jpg",
    alt: "RTX 3090 Ti Founders Edition",
    fit: "contain" as const,
    objectPosition: "50% 45%",
  },
] as const;

export function toGalleryItem(m: MediaItem, fit: "cover" | "contain" = "cover") {
  return {
    src: m.src,
    alt: m.originalName.replace(/[-_]/g, " ").replace(/\.\w+$/, ""),
    objectPosition: "50% 40%",
    fit,
  };
}
