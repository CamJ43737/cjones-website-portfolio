import Link from "next/link";
import { site } from "@/data/content";
import {
  TuskegeeAtmosphere,
  TuskegeeSealWatermark,
} from "@/components/brand/TuskegeeAtmosphere";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 section-pad py-12 sm:py-14">
      <TuskegeeAtmosphere intensity="footer" />
      <TuskegeeSealWatermark
        size="md"
        className="bottom-2 right-4 sm:bottom-4 sm:right-10"
      />

      <div className="relative z-[1] mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-mist">{site.name}</p>
          <p className="mt-2 max-w-md text-sm text-ink-400">
            {site.tagline} AI · Robotics · Agriculture · Healthcare.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-ink-300">
          <a href={`mailto:${site.email}`} className="hover:text-tuskegee-gold">
            Email
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-tuskegee-gold"
          >
            LinkedIn
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-tuskegee-gold"
          >
            GitHub
          </a>
          <Link href="/photography" className="hover:text-tuskegee-gold">
            Photography
          </Link>
        </div>
      </div>
      <p className="relative z-[1] mx-auto mt-10 max-w-6xl text-xs text-ink-500">
        © {new Date().getFullYear()} {site.name}. Built as a living research platform.
      </p>
    </footer>
  );
}
