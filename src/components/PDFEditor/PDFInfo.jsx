'use client';

import React from 'react';
import { FileText, Type, Palette, Image, Hash } from 'lucide-react';

const PDFInfo = ({ info }) => {
  if (!info) return null;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <FileText className="w-5 h-5 mr-2 text-indigo-600" />
        PDF Information
      </h3>
      
      <div className="space-y-3">
        {/* Pages */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <Hash className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pages</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{info.pages}</span>
        </div>
        
        {/* Text Elements */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <Type className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Text Elements</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{info.text_elements_count}</span>
        </div>
        
        {/* Images */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <Image className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{info.images_count}</span>
        </div>
      </div>
      
      {/* Fonts */}
      {info.fonts && info.fonts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Type className="w-4 h-4 mr-1" />
            Fonts Used
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {info.fonts.map((font, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded">
                {font}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Colors */}
      {info.colors && info.colors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Palette className="w-4 h-4 mr-1" />
            Colors Used
          </h4>
          <div className="flex flex-wrap gap-2">
            {info.colors.slice(0, 10).map((color, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">{color.hex}</span>
              </div>
            ))}
            {info.colors.length > 10 && (
              <span className="text-xs text-gray-500">+{info.colors.length - 10} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFInfo;
