const REPO = "/cjones-website-portfolio";

/** Prefix public asset paths for GitHub Pages basePath in production. */
export function asset(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = process.env.NODE_ENV === "production" ? REPO : "";
  return `${base}${normalized}`;
}
