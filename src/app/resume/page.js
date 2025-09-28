'use client';

import React, { useState } from 'react';
import { FileText, User } from 'lucide-react';
import PDFEditorApp from '@/components/PDFEditor/PDFEditorApp';
import ResumeManager from '@/components/ResumeManager/ResumeManager';
import BackendStatus from '@/components/BackendStatus';
// CSS styles are now in globals.css

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState('pdf-editor');

  const tabs = [
    { id: 'pdf-editor', label: 'PDF Editor', icon: FileText },
    { id: 'resume-manager', label: 'Resume Manager', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            PDF & Resume Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced PDF editing and AI-powered resume management
          </p>
          
          {/* Backend Status */}
          <div className="mt-4 flex items-center space-x-2">
            {backendStatus.loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Connecting to backend...
                </span>
              </>
            ) : backendStatus.connected ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Backend connected successfully
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Backend connection failed: {backendStatus.error}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          {activeTab === 'pdf-editor' && <PDFEditorApp />}
          {activeTab === 'resume-manager' && <ResumeManager />}
        </div>
      </div>
    </div>
  );
}
