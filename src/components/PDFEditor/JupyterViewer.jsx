'use client';

import React, { useState } from 'react';
import { BookOpen, Download, Copy, Check } from 'lucide-react';

const JupyterViewer = ({ content, filename, cellCount }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const downloadFile = () => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ? filename.replace('.ipynb', '.html') : 'notebook.html';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span className="font-medium text-gray-800 dark:text-white">{filename}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({cellCount} cells)
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyToClipboard(content)}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy HTML'}
          </button>
          <button
            onClick={downloadFile}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Download HTML
          </button>
        </div>
      </div>
      
      {/* Notebook Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {content ? (
          <div 
            className="p-4 prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No notebook content available
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JupyterViewer;
