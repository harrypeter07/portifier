import { Encryption } from "../components/main/encryption";
import { Hero } from "../components/main/hero";
import { Projects } from "../components/main/projects";
import { Skills } from "../components/main/skills";
import { Navbar } from "../components/main/navbar";
import { Footer } from "../components/main/footer";
import React from "react";
import { About } from "../components/main/about";
import { Contact } from "../components/main/contact";

export default function SpacefolioFull({ data }: { data: any }) {
  return (
    <div
      className="overflow-y-scroll overflow-x-hidden min-h-screen relative"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.08) 0%, transparent 45%),
          linear-gradient(135deg, #070713 0%, #0b0f1a 50%, #0a0c14 100%)
        `
      }}
    >
      <Navbar data={data} />
      <main className="w-full relative">
        <div className="flex flex-col">
          <Hero data={data} />
          <About data={data} />
          <Skills data={data} />
          <Encryption />
          <Projects data={data} />
          <Contact data={data} />
        </div>
      </main>
      <Footer data={data} />
    </div>
  );
}
