import Skills from "../components/Skills";
import DateRange from "../../utility/DateRange";
import Language from "../components/Language";
import Certification from "../components/Certification";
import dynamic from "next/dynamic";
import React from 'react';

const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import("react-beautiful-dnd").then((mod) => mod.Draggable),
  { ssr: false }
);

const LeftSide = ({ resumeData }) => {
  // Get column span based on template style
  const getColumnSpan = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
        return "col-span-1";
      case 'minimal':
        return "col-span-1";
      case 'creative':
        return "col-span-1";
      case 'single-column':
        return "w-full";
      case 'minimal-color':
        return "w-full";
      case 'classic':
      default:
        return "col-span-1";
    }
  };

  // Get colors from resumeData or use defaults
  const colors = resumeData.colors || {
    primary: '#9333ea',
    secondary: '#f0f9ff',
    text: '#1e3a8a',
    background: '#ffffff',
    accent: '#3b82f6'
  };

  // Get template-specific styles as classes
  const getTemplateSpecificStyles = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
        return "p-4 rounded";
      case 'minimal':
        return "";
      case 'creative':
        return "border-l-4 pl-4";
      case 'single-column':
        return "border-b pb-4 mb-4";
      case 'minimal-color':
        return "p-4 rounded mb-4";
      case 'classic':
      default:
        return "";
    }
  };
  
  // Get inline styles based on colors
  const getInlineStyles = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
        return { backgroundColor: colors.secondary };
      case 'minimal':
        return { };
      case 'creative':
        return { borderColor: colors.primary };
      case 'single-column':
        return { borderColor: colors.primary };
      case 'minimal-color':
        return { backgroundColor: `${colors.secondary}` };
      case 'classic':
      default:
        return {};
    }
  };

  return (
    <div 
      className={`${getColumnSpan()} ${getTemplateSpecificStyles()} space-y-2`}
      style={getInlineStyles()}
    >
      {resumeData.summary.length > 0 && (
        <div className="mb-1">
          <h2 className="section-title mb-1 border-b-2 border-gray-300">
            Summary
          </h2>
          <p className="content break-words">{resumeData.summary}</p>
        </div>
      )}

      {resumeData.education.length > 0 && (
        <div className="mb-1">
          <h2 className="section-title mb-1 border-b-2 border-gray-300">
            Education
          </h2>
          {resumeData.education.map((item, index) => (
            <div key={index} className="mb-1">
              <p className="content i-bold">{item.degree}</p>
              <p className="content">{item.school}</p>
              <DateRange
                startYear={item.startYear}
                endYear={item.endYear}
                id={`education-start-end-date`}
              />
            </div>
          ))}
        </div>
      )}

      <Droppable droppableId="skills" type="SKILLS" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {resumeData.skills.map((skill, index) => (
              <Draggable
                key={`SKILLS-${index}`}
                draggableId={`SKILLS-${index}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-1 ${
                      snapshot.isDragging &&
                      "outline-dashed outline-2 outline-gray-400 bg-white"
                    }`}
                  >
                    <Skills title={skill.title} skills={skill.skills} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Language title="Languages" languages={resumeData.languages} />
      <Certification
        title="Certifications"
        certifications={resumeData.certifications}
      />
    </div>
  );
};

export default LeftSide;
