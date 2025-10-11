"use client";
import React from "react";

import { SparklesIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

import {
  slideInFromLeft,
  slideInFromRight,
  slideInFromTop,
} from "../../lib/motion";

export const SkillText = ({ data }: { data: any }) => {
  const personal = data?.personal || {};
  const skills = data?.skills || {};
  
  const skillTagline = personal.skillTagline || "Think better with modern tech";
  const skillTitle = personal.skillTitle || "Making apps with modern technologies";
  const skillSubtitle = personal.skillSubtitle || "Never miss a task, deadline or idea";

  return (
    <div className="flex flex-col justify-center items-center w-full h-auto">
      <motion.div
        variants={slideInFromTop}
        style={{ padding: "8px 7px", border: "1px solid #7042f88b", opacity: 0.9, display: "flex", alignItems: "center" }}
        initial="hidden"
        animate="visible"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[13px]">
          {skillTagline}
        </h1>
      </motion.div>

      <motion.div
        variants={slideInFromLeft(0.5)}
        style={{ fontSize: "30px", color: "white", fontWeight: "500", marginTop: "10px", textAlign: "center", marginBottom: "15px" }}
        initial="hidden"
        animate="visible"
      >
        {skillTitle}
      </motion.div>

      <motion.div
        variants={slideInFromRight(0.5)}
        style={{ fontFamily: "cursive", fontSize: "20px", color: "#e5e7eb", marginBottom: "40px", marginTop: "10px", textAlign: "center" }}
        initial="hidden"
        animate="visible"
      >
        {skillSubtitle}
      </motion.div>
    </div>
  );
};
