import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { FieldPoster } from "@/components/FieldPoster";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { SceneRoot } from "@/components/SceneRoot";
import { ScrollRail } from "@/components/ScrollRail";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <SceneRoot>
        <FieldPoster className="h-full w-full" />
      </SceneRoot>
      <Nav />
      <ScrollRail />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Research />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
