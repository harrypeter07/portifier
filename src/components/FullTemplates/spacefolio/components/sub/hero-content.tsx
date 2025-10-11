"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "../../lib/motion";
import React from "react";
// Replace hardcoded personal info with portfolio data

export const HeroContent = ({ data }: { data: any }) => {
  const personal = data?.personal || {};
  const about = data?.about || {};
  const fullName = personal.firstName && personal.lastName ? `${personal.firstName} ${personal.lastName}` : (personal.title || "");
  const portfolioTagline = personal.tagline || about.summary || "";
  const headlinePrefix = "I am a";
  const headlineHighlight = personal.subtitle || personal.title || "Professional";
  const headlineSuffix = "focused on quality & impact.";
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-center px-20 mt-40 w-full z-[20]"
    >
      <div className="flex flex-col gap-5 justify-center m-auto w-full h-full text-start">
        <motion.div
          variants={slideInFromTop}
          className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]]"
        >
          <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
          <h1 className="Welcome-text text-[13px]">{portfolioTagline}</h1>
        </motion.div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-6 text-6xl text-bold text-white max-w-[600px] w-auto h-auto"
        >
          {/* Big Name Heading above the headline */}
          <span className="text-7xl leading-tight md:text-8xl">
            {fullName ? (
              (() => {
                const parts = fullName.toUpperCase().split(" ");
                const first = parts[0] || fullName;
                const rest = parts.slice(1).join(" ");
                return (
                  <>
                    <span className="text-white">{first}{rest ? " " : ""}</span>
                    {rest && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">{rest}</span>
                    )}
                  </>
                );
              })()
            ) : null}
          </span>

          <span>
            {headlinePrefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              {headlineHighlight}
            </span>{" "}
            {headlineSuffix}
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          {about.summary}
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px]"
        >
          {personal.ctaLabel || "Get in touch"}
        </motion.a>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="flex justify-center items-center w-full h-full"
      >
        <Image
          src="/hero-bg.svg"
          alt="work icons"
          height={650}
          width={650}
          draggable={false}
          className="select-none"
        />
      </motion.div>
    </motion.div>
  );
};
