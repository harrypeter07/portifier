"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "../../lib/motion";
import { SPACEFOLIO_ASSETS } from "../../assets";
import React from "react";
// Replace hardcoded personal info with portfolio data

export const HeroContent = ({ data }: { data: any }) => {
  const personal = data?.personal || {};
  const about = data?.about || {};
  const fullName = personal.firstName && personal.lastName ? `${personal.firstName} ${personal.lastName}` : (personal.title || "");
  const portfolioTagline = personal.tagline || "";
  const headlinePrefix = "I am a";
  const getFirstSkillName = () => {
    const skills = data?.skills || {};
    if (Array.isArray(skills?.technical)) {
      for (const cat of skills.technical) {
        const list = Array.isArray(cat?.skills) ? cat.skills : [];
        const first = list.find((s: any) => (typeof s === 'string' && s) || (s && s.name));
        if (first) return typeof first === 'string' ? first : first.name;
      }
    }
    if (Array.isArray(skills)) {
      const first = skills.find((s: any) => (typeof s === 'string' && s) || (s && s.name));
      if (first) return typeof first === 'string' ? first : first.name;
    }
    return "";
  };
  const headlineHighlight = personal.subtitle || getFirstSkillName() || personal.title || "";
  const headlineSuffix = "focused on quality & impact.";
  return (
    <div className="md:px-20 md:mt-40">
      <motion.div
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          marginTop: "5rem",
          width: "100%",
          zIndex: 20,
        }}
      >
        <div className="flex flex-col gap-5 justify-center m-auto w-full max-w-6xl h-full">
          <div>
            <motion.div
              variants={slideInFromTop}
              style={{ padding: "8px 7px", border: "1px solid #7042f88b", opacity: 0.9 }}
            >
              <div className="Welcome-box">
                <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
                <h1 className="Welcome-text text-[12px] md:text-[13px]">{portfolioTagline}</h1>
              </div>
            </motion.div>
          </div>

          <div className="text-4xl leading-tight md:text-6xl md:leading-tight mx-auto md:mx-0">
            <motion.div
              variants={slideInFromLeft(0.5)}
              style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px", fontWeight: "bold", color: "white", maxWidth: "900px", width: "100%", height: "auto" }}
              initial="hidden"
              animate="visible"
            >
              {/* Big Name Heading above the headline */}
              <span className="text-5xl leading-tight md:text-7xl text-center md:text-left">
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

              <span className="text-2xl md:text-4xl text-center md:text-left">
                {headlinePrefix}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                  {headlineHighlight}
                </span>{" "}
                {headlineSuffix}
              </span>
            </motion.div>
          </div>

          <div className="md:text-lg text-center md:text-left mx-auto md:mx-0">
            <motion.p
              variants={slideInFromLeft(0.8)}
              style={{ fontSize: "1rem", color: "#9ca3af", margin: "16px 0", maxWidth: "900px" }}
              initial="hidden"
              animate="visible"
            >
              {about.summary}
            </motion.p>
          </div>

          <div className="mx-auto md:mx-0">
            <motion.a
              variants={slideInFromLeft(1)}
              style={{ padding: "8px 0", textAlign: "center", color: "white", cursor: "pointer", borderRadius: "8px", maxWidth: "200px", display: "block" }}
              initial="hidden"
              animate="visible"
            >
              {personal.ctaLabel || "Get in touch"}
            </motion.a>
          </div>
        </div>

        <div className="hidden sm:flex">
          <motion.div
            variants={slideInFromRight(0.8)}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}
            initial="hidden"
            animate="visible"
          >
            <Image
              src={SPACEFOLIO_ASSETS.ui[0]}
              alt="work icons"
              height={500}
              width={500}
              style={{ width: "auto", height: "auto" }}
              draggable={false}
              className="select-none w-full max-w-[320px] md:max-w-[500px] h-auto object-contain"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
