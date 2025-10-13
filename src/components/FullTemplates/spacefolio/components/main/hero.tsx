import { HeroContent } from "../sub/hero-content";
import { SPACEFOLIO_ASSETS } from "../../assets";
import React from "react";

export const Hero = ({ data }: { data: any }) => {
  return (
    <div className="flex overflow-hidden relative flex-col w-full h-[100dvh] md:h-screen">
      {/* Blackhole Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="object-cover absolute w-full h-full md:rotate-180"
        style={{ 
          top: '0', 
          left: '0', 
          width: '100%', 
          height: '100%',
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

      {/* Enhanced fallback background gradient */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)
          `,
          zIndex: 0
        }}
      />

      {/* CSS-only floating particles */}
      <div className="overflow-hidden absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Content - Above the video */}
      <div className="flex relative z-20 flex-1 justify-center items-center">
        <HeroContent data={data} />
      </div>
    </div>
  );
};
