'use client';

import React from 'react';
import { FileText, Edit, Trash2, Download, Eye, Search, Calendar, User, Plus } from 'lucide-react';
import LottieLoading from '../LottieLoading';

const ResumeList = ({ resumes, loading, onEdit, onDelete, onAnalyze, onRefresh, onCreateNew }) => {
  if (loading) {
    return (
      <div className="py-12 text-center">
        <LottieLoading 
          message="Loading resumes..." 
          size="large"
          showMessage={true}
          fullScreen={false}
        />
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileText className="mx-auto mb-4 w-16 h-16 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-300">
          No resumes found
        </h3>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Upload your first resume to get started
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Resumes ({resumes.length})
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCreateNew}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700"
          >
            <Plus className="mr-2 w-4 h-4" />
            Create New
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="p-6 bg-white rounded-lg border border-gray-200 transition-shadow dark:bg-gray-700 dark:border-gray-600 hover:shadow-lg"
          >
            {/* Resume Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg dark:bg-indigo-900">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {resume.title || 'Untitled Resume'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {resume.name || 'No name provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Info */}
            <div className="mb-4 space-y-2">
              {resume.email && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <User className="mr-2 w-4 h-4" />
                  {resume.email}
                </div>
              )}
              {resume.createdAt && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="mr-2 w-4 h-4" />
                  {new Date(resume.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Resume Summary */}
            {resume.summary && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {resume.summary}
                </p>
              </div>
            )}

            {/* Skills Preview */}
            {resume.skills && resume.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {resume.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-gray-600 dark:text-gray-300"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {resume.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-gray-600 dark:text-gray-300">
                      +{resume.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAnalyze(resume)}
                className="flex flex-1 justify-center items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              >
                <Search className="mr-1 w-4 h-4" />
                Analyze
              </button>
              
              <button
                onClick={() => onEdit(resume)}
                className="flex justify-center items-center px-3 py-2 text-gray-700 bg-gray-200 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onDelete(resume.id)}
                className="flex justify-center items-center px-3 py-2 text-red-700 bg-red-100 rounded-lg transition-colors dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeList;
