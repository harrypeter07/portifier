import React, { useContext } from 'react';
import { ResumeContext } from '../../builder';

const FontSelector = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const fonts = [
    { id: 'var(--font-inter)', name: 'Inter', description: 'Clean modern sans-serif' },
    { id: 'var(--font-roboto)', name: 'Roboto', description: 'Professional and readable' },
    { id: 'var(--font-merriweather)', name: 'Merriweather', description: 'Elegant serif font' },
    { id: 'var(--font-montserrat)', name: 'Montserrat', description: 'Contemporary geometric sans-serif' },
    { id: 'var(--font-lato)', name: 'Lato', description: 'Balanced and friendly' },
    { id: 'var(--font-open-sans)', name: 'Open Sans', description: 'Highly legible for screens' },
  ];

  const handleFontChange = (fontId) => {
    setResumeData({
      ...resumeData,
      fontFamily: fontId,
    });
  };

  return (
    <div className="mb-4">
      <h2 className="input-title mb-2">Font Style</h2>
      <div className="grid grid-cols-2 gap-2">
        {fonts.map((font) => (
          <div 
            key={font.id}
            className={`p-3 border rounded cursor-pointer transition-all ${resumeData.fontFamily === font.id ? 'bg-white text-fuchsia-600 border-fuchsia-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
            onClick={() => handleFontChange(font.id)}
            style={{ fontFamily: font.id }}
          >
            <div className="font-semibold">{font.name}</div>
            <div className="text-xs">{font.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontSelector;