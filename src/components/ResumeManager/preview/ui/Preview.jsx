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
import {onDragEndHandler} from "../../utility/onDragEndHandler";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

const Preview = () => {
  const {resumeData, setResumeData} = useContext(ResumeContext);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const icons = [
    {name: "github", icon: <FaGithub/>},
    {name: "linkedin", icon: <FaLinkedin/>},
    {name: "twitter", icon: <FaTwitter/>},
    {name: "facebook", icon: <FaFacebook/>},
    {name: "instagram", icon: <FaInstagram/>},
    {name: "youtube", icon: <FaYoutube/>},
    {name: "website", icon: <CgWebsite/>},
  ];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      // Convert the new drag end handler to work with dnd-kit
      const result = {
        destination: { droppableId: over?.id, index: 0 },
        source: { droppableId: active.id, index: 0 }
      };
      onDragEndHandler(result, resumeData, setResumeData);
    }
  };

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
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Header resumeData={resumeData} icons={icons}/>
          <hr className="border-dashed my-2"/>
          <div className={getTemplateLayout()}>
            <LeftSide resumeData={resumeData}/>
            <RightSide resumeData={resumeData}/>
          </div>
        </DndContext>
      </A4PageWrapper>
    </div>
  );
};

export default Preview;
