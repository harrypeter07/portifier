import React, { useContext } from 'react';
import { ResumeContext } from '../../builder';

const ColorSelector = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  // Default colors if not set
  const colors = resumeData.colors || {
    primary: '#9333ea', // Default primary color (fuchsia-600)
    secondary: '#f0f9ff', // Default secondary color (light blue bg)
    text: '#1e3a8a', // Default text color (dark blue)
    background: '#ffffff', // Default background color
    accent: '#3b82f6' // Default accent color (blue-500)
  };

  const handleColorChange = (colorType, value) => {
    setResumeData({
      ...resumeData,
      colors: {
        ...resumeData.colors || colors,
        [colorType]: value
      }
    });
  };

  return (
    <div className="mb-4">
      <h2 className="input-title mb-2">Color Customization</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
          <div className="flex items-center">
            <input
              type="color"
              value={colors.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer mr-2"
            />
            <span className="text-sm">{colors.primary}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
          <div className="flex items-center">
            <input
              type="color"
              value={colors.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer mr-2"
            />
            <span className="text-sm">{colors.secondary}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <div className="flex items-center">
            <input
              type="color"
              value={colors.text}
              onChange={(e) => handleColorChange('text', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer mr-2"
            />
            <span className="text-sm">{colors.text}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
          <div className="flex items-center">
            <input
              type="color"
              value={colors.background}
              onChange={(e) => handleColorChange('background', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer mr-2"
            />
            <span className="text-sm">{colors.background}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
          <div className="flex items-center">
            <input
              type="color"
              value={colors.accent}
              onChange={(e) => handleColorChange('accent', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer mr-2"
            />
            <span className="text-sm">{colors.accent}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSelector;