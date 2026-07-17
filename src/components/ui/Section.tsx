import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  tight?: boolean;
};

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  tight,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "relative section-pad",
        tight ? "py-16 sm:py-20" : "py-24 sm:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || subtitle) && (
          <header className="mb-12 max-w-3xl sm:mb-16">
            {eyebrow && <p className="chapter-label mb-4">{eyebrow}</p>}
            {title && <h2 className="display-title text-balance">{title}</h2>}
            {subtitle && (
              <p className="prose-brand mt-5 max-w-2xl text-pretty">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
