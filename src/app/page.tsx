import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Journey } from "@/components/timeline/Journey";
import { ResearchLab } from "@/components/research/ResearchLab";
import { SkillsEcosystem } from "@/components/skills/SkillsEcosystem";
import { Experience } from "@/components/experience/Experience";
import { Awards } from "@/components/awards/Awards";
import { Leadership } from "@/components/leadership/Leadership";
import { Publications } from "@/components/publications/Publications";
import { PhotographyTeaser } from "@/components/photography/PhotographyTeaser";
import { Contact } from "@/components/contact/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Journey />
      <ResearchLab />
      <SkillsEcosystem />
      <Experience />
      <Awards />
      <Leadership />
      <Publications />
      <PhotographyTeaser />
      <Contact />
    </>
  );
}
