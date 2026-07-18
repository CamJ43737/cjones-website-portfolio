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
        tight ? "py-16 sm:py-20" : "py-20 sm:py-28 lg:py-32",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">
        {(eyebrow || title || subtitle) && (
          <header className="mb-10 max-w-3xl text-left sm:mb-14">
            {eyebrow && <p className="chapter-label mb-3 sm:mb-4">{eyebrow}</p>}
            {title && <h2 className="display-title text-balance">{title}</h2>}
            {subtitle && (
              <p className="prose-brand mt-4 text-pretty sm:mt-5">{subtitle}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
