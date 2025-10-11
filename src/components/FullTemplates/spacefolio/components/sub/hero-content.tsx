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
          style={{ padding: "8px 7px", border: "1px solid #7042f88b", opacity: 0.9 }}
          className="Welcome-box"
        >
          <div className="Welcome-box">
            <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
            <h1 className="Welcome-text text-[13px]">{portfolioTagline}</h1>
          </div>

        <motion.div
          variants={slideInFromLeft(0.5)}
          style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "24px", fontSize: "3.75rem", fontWeight: "bold", color: "white", maxWidth: "600px", width: "auto", height: "auto" }}
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
          style={{ fontSize: "1.125rem", color: "#9ca3af", margin: "20px 0", maxWidth: "600px" }}
        >
          {about.summary}
        </motion.p>

        <motion.a
          variants={slideInFromLeft(1)}
          style={{ padding: "8px 0", textAlign: "center", color: "white", cursor: "pointer", borderRadius: "8px", maxWidth: "200px" }}
          className="button-primary"
        >
          {personal.ctaLabel || "Get in touch"}
        </motion.a>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}
        initial="hidden"
        animate="visible"
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
