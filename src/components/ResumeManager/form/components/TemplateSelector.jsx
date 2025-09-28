import React, { useContext } from 'react';
import { ResumeContext } from '../../builder';

const TemplateSelector = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const templates = [
    { id: 'classic', name: 'Classic', description: 'Traditional single-column layout' },
    { id: 'modern', name: 'Modern', description: 'Contemporary two-column design' },
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple layout' },
    { id: 'creative', name: 'Creative', description: 'Unique design with accent colors' },
    { id: 'single-column', name: 'Single Column', description: 'All sections in one column' },
    { id: 'minimal-color', name: 'Minimal Color', description: 'Light styling with minimal colors' },
  ];

  const handleTemplateChange = (templateId) => {
    setResumeData({
      ...resumeData,
      templateStyle: templateId,
    });
  };

  return (
    <div className="mb-4">
      <h2 className="input-title mb-2">Template Style</h2>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`p-3 border rounded cursor-pointer transition-all ${resumeData.templateStyle === template.id ? 'bg-white text-fuchsia-600 border-fuchsia-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
            onClick={() => handleTemplateChange(template.id)}
          >
            <div className="font-semibold">{template.name}</div>
            <div className="text-xs">{template.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;