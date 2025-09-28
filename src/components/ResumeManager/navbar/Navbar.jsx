import React, { useState, useContext, useRef, useEffect } from 'react';
import { ResumeContext } from '../builder';
import { FiMenu, FiX, FiDownload, FiSettings, FiType, FiLayout } from 'react-icons/fi';

const Navbar = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const navbarRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setTemplateDropdownOpen(false);
        setFontDropdownOpen(false);
        setExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Template options
  const templates = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'professional', name: 'Professional' },
    { id: 'single-column', name: 'Single Column' },
    { id: 'minimal-color', name: 'Minimal Color' }
  ];

  // Font options
  const fonts = [
    { id: 'sans', name: 'Sans-serif' },
    { id: 'serif', name: 'Serif' },
    { id: 'mono', name: 'Monospace' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'open-sans', name: 'Open Sans' },
    { id: 'lato', name: 'Lato' }
  ];

  // Handle template change
  const handleTemplateChange = (templateId) => {
    setResumeData({
      ...resumeData,
      templateStyle: templateId
    });
    setTemplateDropdownOpen(false);
  };

  // Handle font change
  const handleFontChange = (fontId) => {
    setResumeData({
      ...resumeData,
      fontStyle: fontId
    });
    setFontDropdownOpen(false);
  };

  // Export functionality (simplified version without external dependencies)
  const printResume = () => {
    // Use print functionality as a workaround
    window.print();
    setExportDropdownOpen(false);
  };

  return (
    <nav 
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md exclude-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-fuchsia-600">Resume Builder</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-fuchsia-600 hover:text-fuchsia-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-fuchsia-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Template dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setTemplateDropdownOpen(!templateDropdownOpen);
                  setFontDropdownOpen(false);
                  setExportDropdownOpen(false);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <FiLayout className="mr-2 h-5 w-5 text-fuchsia-600" />
                Templates
              </button>
              
              {templateDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateChange(template.id)}
                        className={`block w-full text-left px-4 py-2 text-sm ${resumeData.templateStyle === template.id ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Font dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setFontDropdownOpen(!fontDropdownOpen);
                  setTemplateDropdownOpen(false);
                  setExportDropdownOpen(false);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <FiType className="mr-2 h-5 w-5 text-fuchsia-600" />
                Fonts
              </button>
              
              {fontDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {fonts.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => handleFontChange(font.id)}
                        className={`block w-full text-left px-4 py-2 text-sm ${resumeData.fontStyle === font.id ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Export dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setExportDropdownOpen(!exportDropdownOpen);
                  setTemplateDropdownOpen(false);
                  setFontDropdownOpen(false);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <FiDownload className="mr-2 h-5 w-5 text-fuchsia-600" />
                Export
              </button>
              
              {exportDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <button
                      onClick={printResume}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as PDF / Print
                    </button>
                    <button
                      onClick={printResume}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Print
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Template section */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setTemplateDropdownOpen(!templateDropdownOpen);
                  setFontDropdownOpen(false);
                  setExportDropdownOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <FiLayout className="mr-2 h-5 w-5 text-fuchsia-600" />
                Templates
              </button>
              
              {templateDropdownOpen && (
                <div className="pl-4 space-y-1">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={`w-full text-left px-4 py-2 text-sm ${resumeData.templateStyle === template.id ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Font section */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setFontDropdownOpen(!fontDropdownOpen);
                  setTemplateDropdownOpen(false);
                  setExportDropdownOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <FiType className="mr-2 h-5 w-5 text-fuchsia-600" />
                Fonts
              </button>
              
              {fontDropdownOpen && (
                <div className="pl-4 space-y-1">
                  {fonts.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleFontChange(font.id)}
                      className={`w-full text-left px-4 py-2 text-sm ${resumeData.fontStyle === font.id ? 'bg-fuchsia-100 text-fuchsia-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Export section */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setExportDropdownOpen(!exportDropdownOpen);
                  setTemplateDropdownOpen(false);
                  setFontDropdownOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <FiDownload className="mr-2 h-5 w-5 text-fuchsia-600" />
                Export
              </button>
              
              {exportDropdownOpen && (
                <div className="pl-4 space-y-1">
                  <button
                    onClick={printResume}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF / Print
                  </button>
                  <button
                    onClick={printResume}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Print
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;