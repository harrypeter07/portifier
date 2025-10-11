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
        className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]]"
      >
        <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
        <h1 className="Welcome-text text-[13px]">
          {skillTagline}
        </h1>
      </motion.div>

      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-[30px] text-white font-medium mt-[10px] text-center mb-[15px]"
      >
        {skillTitle}
      </motion.div>

      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-gray-200 mb-10 mt-[10px] text-center"
      >
        {skillSubtitle}
      </motion.div>
    </div>
  );
};
