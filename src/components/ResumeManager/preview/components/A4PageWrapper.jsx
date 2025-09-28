import React, { useContext } from 'react';
import { ResumeContext } from '../../builder';

const A4PageWrapper = ({children}) => {
  const { resumeData } = useContext(ResumeContext);
  
  const alertA4Size = () => {
    const preview = document.querySelector(".preview");
    const previewHeight = preview.offsetHeight;
    console.log(previewHeight);
    if (previewHeight > 1122) {
      alert("A4 size exceeded");
    }
  };

  // Apply different styles based on template style
  const getTemplateStyles = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
        return {
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        };
      case 'minimal':
        return {
          backgroundColor: '#ffffff',
          padding: '0.5rem'
        };
      case 'creative':
        return {
          backgroundColor: '#ffffff',
          borderLeft: '4px solid #9333ea',
          paddingLeft: '0.5rem'
        };
      case 'single-column':
        return {
          backgroundColor: '#ffffff',
          padding: '1rem',
          maxWidth: '700px',
          margin: '0 auto'
        };
      case 'minimal-color':
        return {
          backgroundColor: '#f0f9ff',
          padding: '1rem',
          borderRadius: '8px',
          color: '#1e3a8a'
        };
      case 'classic':
      default:
        return {};
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

  return (
    <div 
      className="w-8.5in" 
      onLoad={alertA4Size}
      style={{ 
        fontFamily: resumeData.fontFamily || 'Inter',
        color: colors.text,
        backgroundColor: colors.background,
        ...getTemplateStyles()
      }}
    >
      {children}
    </div>
  );
};

export default A4PageWrapper;
