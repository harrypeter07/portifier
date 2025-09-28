'use client';

import React, { useState } from 'react';
import { Play, Code, Download, Copy, Check } from 'lucide-react';

const PythonViewer = ({ content, filename, onExecute }) => {
  const [selectedCode, setSelectedCode] = useState('');
  const [executionResult, setExecutionResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const executeCode = async () => {
    if (!selectedCode.trim()) return;
    
    setLoading(true);
    try {
      const result = await onExecute(selectedCode);
      setExecutionResult(result.output || result);
    } catch (error) {
      setExecutionResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
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
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'python_file.py';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-indigo-600" />
          <span className="font-medium text-gray-800 dark:text-white">{filename}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => copyToClipboard(content)}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy All'}
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
      
      {/* Code Display */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Code */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
            <span>Source Code</span>
            <button
              onClick={() => copyToClipboard(content)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <pre className="p-4 text-green-400 text-sm font-mono overflow-auto h-96">
            <code>{content}</code>
          </pre>
        </div>
        
        {/* Code Execution */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Execute Code (Select portion to run)
            </label>
            <textarea
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              rows={10}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Paste or type Python code to execute..."
            />
          </div>
          
          <button
            onClick={executeCode}
            disabled={!selectedCode.trim() || loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Execute Code
          </button>
          
          {/* Execution Result */}
          {executionResult && (
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 text-sm text-gray-300 flex items-center justify-between">
                <span>Output</span>
                <button
                  onClick={() => copyToClipboard(executionResult)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <pre className="p-4 text-green-400 text-sm font-mono overflow-auto max-h-64 whitespace-pre-wrap">
                {executionResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PythonViewer;
