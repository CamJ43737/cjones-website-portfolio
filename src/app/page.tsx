import { Hero } from "@/components/hero/Hero";
import { IdentityRing } from "@/components/hero/IdentityRing";
import { About } from "@/components/about/About";
import { Milestones } from "@/components/milestones/Milestones";
import { ResearchLab } from "@/components/research/ResearchLab";
import { SelectedExperience } from "@/components/experience/SelectedExperience";
import { Recognition } from "@/components/recognition/Recognition";
import { PublicationsCTA } from "@/components/publications/PublicationsCTA";
import { BeyondTheLab } from "@/components/beyond/BeyondTheLab";
import { Contact } from "@/components/contact/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IdentityRing />
      <About />
      <Milestones />
      <ResearchLab featuredOnly />
      <SelectedExperience />
      <Recognition />
      <PublicationsCTA />
      <BeyondTheLab />
      <Contact />
    </>
  );
}
