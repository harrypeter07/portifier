import { Encryption } from "../components/main/encryption";
import { Hero } from "../components/main/hero";
import { Projects } from "../components/main/projects";
import { Skills } from "../components/main/skills";
import { Navbar } from "../components/main/navbar";
import { Footer } from "../components/main/footer";
import { StarsCanvas } from "../components/main/star-background";
import React from "react";

export default function SpacefolioFull({ data }: { data: any }) {
  return (
    <div className="bg-[#030014] overflow-y-scroll overflow-x-hidden min-h-screen">
      <StarsCanvas />
      <Navbar data={data} />
      <main className="w-full h-full">
        <div className="flex flex-col gap-20">
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
