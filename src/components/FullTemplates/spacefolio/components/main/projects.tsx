import { ProjectCard } from "../sub/project-card";

export const Projects = ({ data }: { data: any }) => {
  const items = data?.projects?.items || [];
  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-10">
        My Projects
      </h1>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((project: any) => (
          <ProjectCard
            key={project.id || project.title}
            src={(project.images && project.images[0]) || "/spacefolio/public/projects/project-1.png"}
            title={project.title}
            description={project.description}
            link={project.links?.live || project.links?.github || "#"}
          />
        ))}
      </div>
    </section>
  );
};
