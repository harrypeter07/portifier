import WorkExperiences from "./workExperience/ui/WorkExperiences";
import Projects from "./projects/ui/Projects";
import React, { useContext } from 'react';
import { ResumeContext } from '../../builder';

const RightSide = ({resumeData}) => {
  // Get colors from resumeData or use defaults
  const colors = resumeData.colors || {
    primary: '#9333ea',
    secondary: '#f0f9ff',
    text: '#1e3a8a',
    background: '#ffffff',
    accent: '#3b82f6'
  };

  // Get column span based on template style
  const getColumnSpan = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
      case 'creative':
        return "col-span-1";
      case 'minimal':
        return "col-span-2";
      case 'single-column':
      case 'minimal-color':
        return "w-full";
      case 'classic':
      default:
        return "col-span-1";
    }
  };
  
  // Get template-specific styles as classes
  const getTemplateSpecificStyles = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
        return "p-4 rounded";
      case 'minimal':
        return "";
      case 'creative':
        return "p-4 rounded";
      case 'single-column':
        return "";
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
        return { backgroundColor: `${colors.primary}10` }; // Light primary color
      case 'minimal':
        return {};
      case 'creative':
        return { backgroundColor: `${colors.accent}10` }; // Light accent color
      case 'single-column':
        return {};
      case 'minimal-color':
        return { backgroundColor: `${colors.accent}10` };
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
      {resumeData.workExperience.length > 0 && (
        <WorkExperiences/>
      )}
      {resumeData.projects.length > 0 && (
        <Projects/>
      )}
    </div>
  );
};

export default RightSide;
