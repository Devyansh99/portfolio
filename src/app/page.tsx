import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";
import { Timeline } from "@/components/Timeline";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Research />
        <Skills />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
