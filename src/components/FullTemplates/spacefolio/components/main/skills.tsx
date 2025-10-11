import React from "react";
import { SkillDataProvider } from "../sub/skill-data-provider";
import { SkillText } from "../sub/skill-text";
import { getRandomSkillIcon, SPACEFOLIO_ASSETS } from "../../assets";

export const Skills = ({ data }: { data: any }) => {
  const skills = data?.skills || {};
  const tech = Array.isArray(skills.technical)
    ? skills.technical.flatMap((cat: any, catIndex: number) => (cat.skills || []).map((s: any, skillIndex: number) => ({
        skill_name: s.name,
        image: getRandomSkillIcon((catIndex * 10 + skillIndex) % SPACEFOLIO_ASSETS.skills.length),
        width: 80,
        height: 80,
      })))
    : [];

  return (
    <section
      id="skills"
      style={{ transform: "scale(0.9)" }}
      className="flex overflow-hidden relative flex-col gap-3 justify-center items-center py-20 h-full"
    >
      <SkillText data={data} />

      <div className="flex flex-row flex-wrap gap-5 justify-around items-center mt-4">
        {tech.slice(0, 12).map((skill: any, i: number) => (
          <SkillDataProvider
            key={skill.skill_name}
            src={skill.image}
            name={skill.skill_name}
            width={skill.width}
            height={skill.height}
            index={i}
          />
        ))}
      </div>

      <div className="absolute w-full h-full">
        <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
          <video
            className="w-full h-auto"
            preload="false"
            playsInline
            loop
            muted
            autoPlay
          >
            <source src="/videos/skills-bg.webm" type="video/webm" />
          </video>
        </div>
      </div>
    </section>
  );
};
