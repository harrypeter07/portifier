import React from "react";
import { ProjectCard } from "../sub/project-card";

export const Projects = ({ data }: { data: any }) => {
  const items = data?.projects?.items || [];
  return (
    <section
      id="projects"
      className="flex flex-col justify-center items-center px-4 py-20"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
        My Projects
      </h1>
      <div className="grid grid-cols-1 gap-6 w-full max-w-7xl md:grid-cols-2 lg:grid-cols-3">
        {items.map((project: any) => (
          <ProjectCard
            key={project.id || project.title}
            src={(project.images && project.images[0]) || "/projects/project-1.png"}
            title={project.title}
            description={project.description}
            link={project.links?.live || project.links?.github || "#"}
          />
        ))}
      </div>
    </section>
  );
};
