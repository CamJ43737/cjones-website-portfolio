"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks, site } from "@/data/content";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { asset } from "@/lib/asset";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-white/5 bg-obsidian/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="section-pad mx-auto flex h-16 max-w-6xl items-center justify-between sm:h-18">
        <Link href="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-lg font-semibold tracking-tight text-mist transition group-hover:text-cyan-electric">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-300 transition hover:text-mist"
            >
              {l.label}
            </Link>
          ))}
          <Button href={asset(site.resumePath)} variant="ghost" download className="!py-2 !px-4">
            Resume
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex rounded-full border border-white/10 p-2 text-mist lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-b border-white/5 bg-obsidian/95 backdrop-blur-xl lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="section-pad flex flex-col gap-1 py-4" aria-label="Mobile">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-3 text-base text-mist hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Button
            href={asset(site.resumePath)}
            download
            className="mt-2"
            variant="primary"
          >
            Download Resume
          </Button>
        </nav>
      </div>
    </header>
  );
}
