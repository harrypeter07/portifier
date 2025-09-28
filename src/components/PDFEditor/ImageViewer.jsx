'use client';

import React, { useState } from 'react';
import { Image, Download, Copy, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ImageViewer = ({ imageData, filename }) => {
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(imageData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image data: ', err);
    }
  };
  
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename || 'image.png';
    link.click();
  };
  
  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 3.0) {
      setZoom(zoom + 0.25);
    } else if (direction === 'out' && zoom > 0.25) {
      setZoom(zoom - 0.25);
    }
  };
  
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };
  
  const resetView = () => {
    setZoom(1.0);
    setRotation(0);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Image className="w-5 h-5 text-indigo-600" />
          <span className="font-medium text-gray-800 dark:text-white">{filename}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy Data'}
          </button>
          <button
            onClick={downloadFile}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </div>
      </div>
      
      {/* Image Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
        
        <button
          onClick={handleRotate}
          className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
        >
          <RotateCw className="w-5 h-5" />
        </button>
        
        <button
          onClick={resetView}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Reset View
        </button>
      </div>
      
      {/* Image Display */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-center h-full">
          {imageData ? (
            <div className="relative">
              <img
                src={imageData}
                alt={filename || 'Image'}
                className="max-w-full max-h-full shadow-lg"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  transition: 'transform 0.2s ease-in-out'
                }}
              />
            </div>
          ) : (
            <div className="text-center">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No image data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
