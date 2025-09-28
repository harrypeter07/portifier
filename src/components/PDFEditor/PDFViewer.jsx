'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import apiClient from '../../utils/api';

const PDFViewer = ({ pdfData, onElementClick, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [pageImage, setPageImage] = useState(null);
  const [textElements, setTextElements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('PDFViewer - pdfData changed:', pdfData);
    if (pdfData && pdfData.pages) {
      console.log('PDFViewer - Loading page:', currentPage);
      loadPage(currentPage);
    }
  }, [pdfData, currentPage, zoom]);

  // Initialize current page when PDF data changes
  useEffect(() => {
    if (pdfData && pdfData.currentPage !== undefined) {
      setCurrentPage(pdfData.currentPage);
    }
  }, [pdfData]);

  const loadPage = async (pageNum) => {
    setLoading(true);
    try {
      // Call the backend API to get the page image and elements
      const pageData = await apiClient.getPage(pageNum, zoom);
      
      if (pageData && pageData.page_image) {
        setPageImage(pageData.page_image);
        setTextElements(pageData.text_elements || []);
      } else {
        console.error('Failed to load page data');
        // Fallback to placeholder
        setPageImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        setTextElements([]);
      }
    } catch (error) {
      console.error('Error loading page:', error);
      // Fallback to placeholder
      setPageImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      setTextElements([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < (pdfData?.pages || 1)) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleZoom = (direction) => {
    if (direction === 'in' && zoom < 3.0) {
      setZoom(zoom + 0.25);
    } else if (direction === 'out' && zoom > 0.5) {
      setZoom(zoom - 0.25);
    }
  };

  const handleElementClick = (element) => {
    onElementClick?.(element);
  };

  if (!pdfData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No PDF loaded</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {currentPage + 1} of {pdfData.pages || 1}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= (pdfData.pages || 1) - 1}
            className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setZoom(1.0)}
            className="p-2 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="relative inline-block">
            {pageImage && (
              <div className="relative">
                <img
                  src={pageImage}
                  alt={`Page ${currentPage + 1}`}
                  className="shadow-lg"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                />
                
                {/* Text Elements Overlay */}
                {textElements.map((element, index) => (
                  <div
                    key={index}
                    onClick={() => handleElementClick(element)}
                    className="absolute border-2 border-transparent hover:border-blue-500 cursor-pointer transition-colors"
                    style={{
                      left: element.bbox[0] * zoom,
                      top: element.bbox[1] * zoom,
                      width: (element.bbox[2] - element.bbox[0]) * zoom,
                      height: (element.bbox[3] - element.bbox[1]) * zoom,
                    }}
                    title={element.text}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Page Navigation */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        {Array.from({ length: Math.min(pdfData.pages || 1, 10) }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentPage === i
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            {i + 1}
          </button>
        ))}
        {(pdfData.pages || 1) > 10 && (
          <span className="text-gray-500 dark:text-gray-400">...</span>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
