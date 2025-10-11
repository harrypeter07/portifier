import { HeroContent } from "../sub/hero-content";
import { SPACEFOLIO_ASSETS } from "../../assets";
import React from "react";

export const Hero = ({ data }: { data: any }) => {
  return (
    <div className="flex relative flex-col w-full h-full">
      <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-340px] left-0 w-full h-full object-cover -z-20"
      >
        <source src={SPACEFOLIO_ASSETS.videos[0]} type="video/webm" />
      </video>

      <HeroContent data={data} />
    </div>
  );
};
