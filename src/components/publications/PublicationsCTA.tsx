import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

export function PublicationsCTA() {
  return (
    <Section
      id="publications"
      eyebrow="Scholarship"
      title="Research publications, posters, and presentations."
      subtitle="Manuscripts, poster sessions, certificates, and talk materials — archived for academic review."
      tight
    >
      <Reveal>
        <Link
          href="/publications"
          className="inline-flex items-center gap-2 rounded-full border border-tuskegee-gold/35 bg-tuskegee-gold/10 px-6 py-3 text-sm text-tuskegee-gold transition hover:border-tuskegee-gold/55 hover:bg-tuskegee-gold/15"
        >
          View publications
          <ArrowUpRight size={16} />
        </Link>
      </Reveal>
    </Section>
  );
}
