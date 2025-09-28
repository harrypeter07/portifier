'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, Code, BookOpen, FileText } from 'lucide-react';

const FileUploader = ({ onFileUpload, loading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      let fileType = 'pdf';
      
      if (extension === 'py') fileType = 'python';
      else if (extension === 'ipynb') fileType = 'jupyter';
      else if (extension === 'docx') fileType = 'word';
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) fileType = 'image';
      
      onFileUpload(file, fileType);
    });
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/x-python': ['.py'],
      'application/x-ipynb+json': ['.ipynb'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    },
    multiple: false,
  });
  
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8" />;
      case 'python': return <Code className="w-8 h-8" />;
      case 'jupyter': return <BookOpen className="w-8 h-8" />;
      case 'image': return <Image className="w-8 h-8" />;
      default: return <File className="w-8 h-8" />;
    }
  };
  
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
      } ${loading ? 'pointer-events-none opacity-50' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        {loading ? (
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-gray-400" />
        )}
        
        <div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {loading ? 'Processing...' : isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supports PDF, Python (.py), Jupyter (.ipynb), Word (.docx), Images
          </p>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-400">
          <FileText className="w-6 h-6" />
          <Code className="w-6 h-6" />
          <BookOpen className="w-6 h-6" />
          <Image className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
