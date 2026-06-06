"use client";

import ScrollStory from "@/components/ui/ScrollStory";
import Hero from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { PersonalSide } from "@/components/sections/PersonalSide";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <ScrollStory>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <PersonalSide />
      <Education />
      <Contact />
    </ScrollStory>
  );
}
