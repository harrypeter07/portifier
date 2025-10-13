import { Encryption } from "../components/main/encryption";
import { Hero } from "../components/main/hero";
import { Projects } from "../components/main/projects";
import { Skills } from "../components/main/skills";
import { Navbar } from "../components/main/navbar";
import { Footer } from "../components/main/footer";
import React from "react";

export default function SpacefolioFull({ data }: { data: any }) {
  return (
    <div
      className="overflow-y-scroll overflow-x-hidden min-h-screen relative"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.25) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.25) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.18) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)
        `
      }}
    >
      <Navbar data={data} />
      <main className="w-full relative">
        <div className="flex flex-col">
          <Hero data={data} />
          <Skills data={data} />
          <Encryption />
          <Projects data={data} />
        </div>
      </main>
      <Footer data={data} />
    </div>
  );
}
