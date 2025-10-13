import React from "react";

export const About = ({ data }: { data: any }) => {
  const about = data?.about || {};
  const personal = data?.personal || {};
  const summary = about.summary || about.bio || personal.tagline || "";
  const interests: string[] = Array.isArray(about.interests) ? about.interests : [];

  return (
    <section id="about" className="flex flex-col items-center justify-center w-full px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
        About Me
      </h2>
      {summary ? (
        <p className="max-w-3xl text-sm md:text-base text-gray-300 leading-relaxed text-center md:text-left">
          {summary}
        </p>
      ) : null}
      {interests.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-6 max-w-3xl">
          {interests.slice(0, 12).map((item, i) => (
            <span key={`${item}-${i}`} className="px-3 py-1 text-xs md:text-sm rounded-full border border-[rgba(112,66,248,0.35)] text-gray-200">
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
};
