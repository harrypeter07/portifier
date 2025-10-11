import { HeroContent } from "../sub/hero-content";
import { SPACEFOLIO_ASSETS } from "../../assets";
import React from "react";

export const Hero = ({ data }: { data: any }) => {
  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden">
      {/* Blackhole Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover rotate-180"
        style={{ 
          top: '-20%', 
          left: '0', 
          width: '100%', 
          height: '120%',
          zIndex: 1
        }}
        onError={(e) => {
          console.error("Video failed to load:", e);
        }}
        onLoadStart={() => {
          console.log("Video started loading:", SPACEFOLIO_ASSETS.videos[0]);
        }}
        onCanPlay={() => {
          console.log("Video can play:", SPACEFOLIO_ASSETS.videos[0]);
        }}
      >
        <source src={SPACEFOLIO_ASSETS.videos[0]} type="video/webm" />
        <source src="/videos/blackhole.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback background gradient */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          zIndex: 0
        }}
      />

      {/* Hero Content - Above the video */}
      <div className="relative z-20 flex-1 flex items-center justify-center">
        <HeroContent data={data} />
      </div>
    </div>
  );
};
