/* eslint-disable react/jsx-no-undef */
import {FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube,} from "react-icons/fa";
import {CgWebsite} from "react-icons/cg";
import React, {useContext, useState} from "react";
import {ResumeContext} from "../../builder";
import dynamic from "next/dynamic";
import ModalHighlightMenu from "../components/ModalHighlightMenu";
import Header from "../components/Header";
import LeftSide from "../components/LeftSide";
import RightSide from "../components/RightSide";
import A4PageWrapper from "../components/A4PageWrapper";
import {onDragEndHandler} from "../utils/onDrugEndHandler";

const DragDropContext = dynamic(
  () =>
    import("react-beautiful-dnd").then((mod) => {
      return mod.DragDropContext;
    }),
  {ssr: false}
);

const Preview = () => {
  const {resumeData, setResumeData} = useContext(ResumeContext);
  const icons = [
    {name: "github", icon: <FaGithub/>},
    {name: "linkedin", icon: <FaLinkedin/>},
    {name: "twitter", icon: <FaTwitter/>},
    {name: "facebook", icon: <FaFacebook/>},
    {name: "instagram", icon: <FaInstagram/>},
    {name: "youtube", icon: <FaYoutube/>},
    {name: "website", icon: <CgWebsite/>},
  ];

  // Get layout based on template style
  const getTemplateLayout = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
        return "grid grid-cols-3 gap-6";
      case 'minimal':
        return "grid grid-cols-1 gap-4";
      case 'creative':
        return "grid grid-cols-2 gap-8";
      case 'single-column':
        return "flex flex-col gap-4";
      case 'minimal-color':
        return "flex flex-col gap-4";
      case 'classic':
      default:
        return "grid grid-cols-3 gap-6";
    }
  };

  return (
    <div className="preview md:max-w-[60%] sticky top-0 rm-padding-print p-6 md:overflow-y-scroll md:h-screen">
      <A4PageWrapper>
        <ModalHighlightMenu/>
        <DragDropContext onDragEnd={onDragEndHandler}>
          <Header resumeData={resumeData} icons={icons}/>
          <hr className="border-dashed my-2"/>
          <div className={getTemplateLayout()}>
            <LeftSide resumeData={resumeData}/>
            <RightSide resumeData={resumeData}/>
          </div>
        </DragDropContext>
      </A4PageWrapper>
    </div>
  );
};

export default Preview;
