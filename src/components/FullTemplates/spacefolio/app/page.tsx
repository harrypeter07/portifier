import { Encryption } from "../components/main/encryption";
import { Hero } from "../components/main/hero";
import { Projects } from "../components/main/projects";
import { Skills } from "../components/main/skills";

export default function SpacefolioFull({ data }: { data: any }) {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero data={data} />
        <Skills data={data} />
        <Encryption />
        <Projects data={data} />
      </div>
    </main>
  );
}
