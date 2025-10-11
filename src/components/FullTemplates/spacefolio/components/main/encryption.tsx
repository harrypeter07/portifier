"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { slideInFromTop } from "../../lib/motion";
import { SPACEFOLIO_ASSETS } from "../../assets";
import React from "react";

export const Encryption = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleToggleVideo = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsPaused(false);
    } else {
      vid.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className="flex relative flex-row justify-center items-center w-full h-full min-h-screen">
      <div className="absolute w-auto h-auto top-0 z-[5]">
        <motion.div
          variants={slideInFromTop}
          style={{ fontSize: "40px", fontWeight: "500", textAlign: "center", color: "#e5e7eb" }}
        >
          Performance{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
            &
          </span>{" "}
          security.
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center translate-y-[-50px] absolute z-[20] w-auto h-auto">
        <div className="flex flex-col items-center w-auto h-auto cursor-pointer group">
          <Image
            src={SPACEFOLIO_ASSETS.ui[3]}
            alt="Lock top"
            width={50}
            height={50}
            style={{ width: "auto", height: "auto" }}
            className="transition-all duration-200 translate-y-5 group-hover:translate-y-11 w-12 h-12 object-contain"
          />
          <Image
            src={SPACEFOLIO_ASSETS.ui[2]}
            alt="Lock main"
            width={70}
            height={70}
            style={{ width: "auto", height: "auto" }}
            className="z-10 w-16 h-16 object-contain"
          />
        </div>

        <div className="Welcome-box px-[15px] py-[4px] z-[20] border my-[20px] border-[#7042F88B] opacity-[0.9]">
          <h1 className="Welcome-text text-[12px]">Encryption</h1>
        </div>

        <button
          type="button"
          onClick={handleToggleVideo}
          className="px-4 py-2 mt-2 text-white rounded-lg button-primary"
          aria-pressed={isPaused}
        >
          {isPaused ? "Resume Background" : "Pause Background"}
        </button>
      </div>

      <div className="absolute z-[20] bottom-[10px] px-[5px]">
        <div className="cursive text-[20px] font-medium text-center text-gray-300">
          Secure your data with end-to-end encryption.
        </div>
      </div>

      <div className="flex absolute z-0 justify-center items-start w-full">
        <video
          ref={videoRef}
          loop
          muted
          autoPlay
          playsInline
          preload="false"
          className="w-full h-auto"
        >
          <source src={SPACEFOLIO_ASSETS.videos[1]} type="video/webm" />
        </video>
      </div>
    </div>
  );
};
