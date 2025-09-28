'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Upload, Plus, Edit, Trash2, Download, Eye, Search, Palette, FileEdit } from 'lucide-react';
import ResumeUploader from './ResumeUploader';
import ResumeList from './ResumeList';
import ResumeAnalyzer from './ResumeAnalyzer';
import ResumeBuilder from './builder';
import apiClient from '../../utils/api';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'upload', 'analyze', 'builder'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const response = await apiClient.listResumes();
      setResumes(response.resumes || []);
    } catch (err) {
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (file, resumeData) => {
    setLoading(true);
    try {
      const response = await apiClient.saveResume({
        file,
        ...resumeData
      });
      
      if (response.success) {
        await loadResumes();
        setActiveTab('list');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeDelete = async (resumeId) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    setLoading(true);
    try {
      await apiClient.deleteResume(resumeId);
      await loadResumes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeEdit = (resume) => {
    setSelectedResume(resume);
    setActiveTab('builder');
  };

  const handleResumeAnalyze = (resume) => {
    setSelectedResume(resume);
    setActiveTab('analyze');
  };

  const handleCreateNew = () => {
    setSelectedResume(null);
    setActiveTab('builder');
  };

  const tabs = [
    { id: 'list', label: 'My Resumes', icon: FileText },
    { id: 'upload', label: 'Upload New', icon: Upload },
    { id: 'builder', label: 'Resume Builder', icon: Palette },
    { id: 'analyze', label: 'Analyze', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Resume Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create, analyze, and manage your resumes with AI-powered insights and professional templates
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

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'builder' ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <ResumeBuilder 
              initialData={selectedResume}
              onSave={async (resumeData) => {
                try {
                  await apiClient.saveResume(resumeData);
                  await loadResumes();
                  setActiveTab('list');
                } catch (err) {
                  setError(err.message);
                }
              }}
              onBack={() => setActiveTab('list')}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            {activeTab === 'list' && (
              <ResumeList
                resumes={resumes}
                loading={loading}
                onEdit={handleResumeEdit}
                onDelete={handleResumeDelete}
                onAnalyze={handleResumeAnalyze}
                onRefresh={loadResumes}
                onCreateNew={handleCreateNew}
              />
            )}

            {activeTab === 'upload' && (
              <ResumeUploader
                onUpload={handleResumeUpload}
                loading={loading}
              />
            )}

            {activeTab === 'analyze' && selectedResume && (
              <ResumeAnalyzer
                resume={selectedResume}
                onBack={() => setActiveTab('list')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeManager;
