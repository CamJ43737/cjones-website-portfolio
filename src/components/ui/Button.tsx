import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "gold";

const variants: Record<Variant, string> = {
  primary:
    "bg-cyan-electric text-obsidian hover:bg-mist shadow-glow border border-cyan-electric/40",
  ghost:
    "bg-transparent text-mist border border-white/15 hover:border-cyan-electric/50 hover:bg-white/5",
  gold:
    "bg-tuskegee-gold/15 text-tuskegee-gold border border-tuskegee-gold/40 hover:bg-tuskegee-gold/25",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external,
  download,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-electric",
    variants[variant],
    className,
  );

  if (external || download || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
