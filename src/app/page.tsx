import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { Hero } from "@/sections/Hero";
import { TechStack } from "@/sections/TechStack";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { Process } from "@/sections/Process";
import { Stats } from "@/sections/Stats";
import { Contact } from "@/sections/Contact";
import { getPublicData } from "@/lib/public-data";
import type {
  PublicProfile,
  PublicProject,
  PublicProcessStep,
  PublicSkill,
  PublicStat,
} from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default function Home() {
  const { profile, projects, skills, processSteps, stats, settings } = getPublicData();

  const showProjects = settings.showProjects !== false;
  const showStats = settings.showStats !== false;

  return (
    <>
      <Header profile={profile} />
      <main>
        <Hero profile={profile} />
        <TechStack />
        <About profile={profile} />
        <Skills skills={skills} />
        {showProjects && <Projects projects={projects} />}
        <Process steps={processSteps} />
        {showStats && <Stats stats={stats} />}
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <BackToTop />
    </>
  );
}
