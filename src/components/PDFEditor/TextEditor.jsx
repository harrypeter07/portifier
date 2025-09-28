'use client';

import React, { useState } from 'react';
import { Type, Palette, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, X } from 'lucide-react';

const TextEditor = ({ element, onUpdate, onCancel }) => {
  const [text, setText] = useState(element?.text || '');
  const [fontSize, setFontSize] = useState(element?.font_size || 12);
  const [color, setColor] = useState(
    element ? `#${element.color[0].toString(16).padStart(2, '0')}${element.color[1].toString(16).padStart(2, '0')}${element.color[2].toString(16).padStart(2, '0')}` : '#000000'
  );
  const [isBold, setIsBold] = useState(element?.font_flags & 16 || false);
  const [isItalic, setIsItalic] = useState(element?.font_flags & 2 || false);
  const [alignment, setAlignment] = useState('left');
  
  const handleUpdate = () => {
    const colorRgb = [
      parseInt(color.slice(1, 3), 16),
      parseInt(color.slice(3, 5), 16),
      parseInt(color.slice(5, 7), 16)
    ];
    
    onUpdate({
      text,
      font_size: fontSize,
      color: colorRgb,
      bold: isBold,
      italic: isItalic,
      alignment,
    });
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 min-w-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Text Element</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Text Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter text content..."
          />
        </div>
        
        {/* Formatting Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min="6"
              max="72"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
        
        {/* Text Style Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Style
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-2 rounded-lg transition-colors ${
                isBold ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`p-2 rounded-lg transition-colors ${
                isItalic ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Alignment Controls */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Alignment
          </label>
          <div className="flex items-center space-x-2">
            {['left', 'center', 'right'].map((align) => {
              const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
              return (
                <button
                  key={align}
                  onClick={() => setAlignment(align)}
                  className={`p-2 rounded-lg transition-colors ${
                    alignment === align ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Apply Changes
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
