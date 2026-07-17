/**
 * Prefix public asset paths when deploying under a subdirectory.
 * Must match NEXT_PUBLIC_BASE_PATH / next.config basePath.
 * On Vercel (root), this stays empty so /images/... and /_next/... resolve correctly.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

export function asset(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!basePath) return normalized;
  if (normalized.startsWith(`${basePath}/`) || normalized === basePath) {
    return normalized;
  }
  return `${basePath}${normalized}`;
}
