'use client';

import React, { useState, useCallback } from 'react';
import { FileText, Upload, Download, Search, Edit3, Image, Code, BookOpen } from 'lucide-react';
import FileUploader from './FileUploader';
import PDFViewer from './PDFViewer';
import TextEditor from './TextEditor';
import PythonViewer from './PythonViewer';
import JupyterViewer from './JupyterViewer';
import ImageViewer from './ImageViewer';
import SearchReplace from './SearchReplace';
import PDFInfo from './PDFInfo';
import apiClient from '../../utils/api';

const PDFEditorApp = () => {
  const [currentFile, setCurrentFile] = useState(null);
  const [fileType, setFileType] = useState('pdf');
  const [pdfData, setPdfData] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showSearchReplace, setShowSearchReplace] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback(async (file, type) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.uploadFile(file, type);
      
      if (response.success) {
        setCurrentFile(file);
        setFileType(type);
        
        if (type === 'pdf') {
          setPdfData(response);
          // Get PDF info
          const info = await apiClient.getPdfInfo();
          setPdfData(prev => ({ ...prev, info }));
        }
      } else {
        setError(response.error || 'Failed to upload file');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleElementClick = (element) => {
    if (fileType === 'pdf') {
      setSelectedElement(element);
      setShowTextEditor(true);
    }
  };

  const handleTextUpdate = async (updates) => {
    try {
      const response = await apiClient.updateText(
        selectedElement.element_id,
        updates.text,
        updates.font_size,
        updates.color
      );
      
      if (response.success) {
        // Refresh the page data
        const pageData = await apiClient.getPage(selectedElement.page_num);
        setPdfData(prev => ({
          ...prev,
          pages: { ...prev.pages, [selectedElement.page_num]: pageData }
        }));
        setShowTextEditor(false);
        setSelectedElement(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchReplace = async (searchTerm, replaceWith) => {
    try {
      const response = await apiClient.searchReplace(searchTerm, replaceWith);
      if (response.success) {
        // Refresh current page
        if (pdfData && pdfData.currentPage !== undefined) {
          const pageData = await apiClient.getPage(pdfData.currentPage);
          setPdfData(prev => ({
            ...prev,
            pages: { ...prev.pages, [pdfData.currentPage]: pageData }
          }));
        }
        setShowSearchReplace(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await apiClient.downloadPDF();
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited_document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderFileViewer = () => {
    if (!currentFile) return null;

    switch (fileType) {
      case 'pdf':
        return (
          <PDFViewer
            pdfData={pdfData}
            onElementClick={handleElementClick}
            onPageChange={(pageNum) => {
              setPdfData(prev => ({ ...prev, currentPage: pageNum }));
            }}
          />
        );
      case 'python':
        return (
          <PythonViewer
            content={pdfData?.content}
            filename={currentFile.name}
            onExecute={apiClient.executePythonCode}
          />
        );
      case 'jupyter':
        return (
          <JupyterViewer
            content={pdfData?.html_content}
            filename={currentFile.name}
            cellCount={pdfData?.cell_count}
          />
        );
      case 'image':
        return (
          <ImageViewer
            imageData={pdfData?.data}
            filename={currentFile.name}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            PDF Editor & Resume Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload, analyze, and edit PDFs, Python files, and Jupyter notebooks
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Tools & Info
              </h2>
              
              {/* File Upload */}
              <div className="mb-6">
                <FileUploader
                  onFileUpload={handleFileUpload}
                  loading={loading}
                />
              </div>

              {/* PDF Info */}
              {fileType === 'pdf' && pdfData?.info && (
                <div className="mb-6">
                  <PDFInfo info={pdfData.info} />
                </div>
              )}

              {/* Action Buttons */}
              {currentFile && (
                <div className="space-y-3">
                  {fileType === 'pdf' && (
                    <>
                      <button
                        onClick={() => setShowSearchReplace(true)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search & Replace
                      </button>
                      
                      <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 min-h-[600px]">
              {currentFile ? (
                renderFileViewer()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    No file selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Upload a PDF, Python file, or Jupyter notebook to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showTextEditor && selectedElement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <TextEditor
                element={selectedElement}
                onUpdate={handleTextUpdate}
                onCancel={() => {
                  setShowTextEditor(false);
                  setSelectedElement(null);
                }}
              />
            </div>
          </div>
        )}

        {showSearchReplace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
              <SearchReplace
                onSearchReplace={handleSearchReplace}
                onCancel={() => setShowSearchReplace(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFEditorApp;
