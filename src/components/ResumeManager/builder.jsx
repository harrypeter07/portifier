"use client"

import React, {createContext, useState, useEffect} from "react";
import FormCloseOpenBtn from "./FormCloseOpenBtn";
import Preview from "./preview/ui/Preview";
import DefaultResumeData from "./utility/DefaultResumeData";
import dynamic from "next/dynamic";
import Form from "./form/ui/Form";
import { ArrowLeft, Save, Download } from "lucide-react";

const ResumeContext = createContext(DefaultResumeData);

// server side rendering false
const Print = dynamic(() => import("./utility/WinPrint"), {
  ssr: false,
});

export default function Builder({ initialData = null, onSave, onBack }) {
  // resume data
  const [resumeData, setResumeData] = useState(initialData || DefaultResumeData);
  const [saving, setSaving] = useState(false);

  // form hide/show
  const [formClose, setFormClose] = useState(false);

  // Update resume data when initialData changes
  useEffect(() => {
    if (initialData) {
      setResumeData(initialData);
    }
  }, [initialData]);

  // profile picture
  const handleProfilePicture = (e) => {
    const file = e.target.files[0];

    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData({...resumeData, profilePicture: event.target.result});
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Invalid file type");
    }
  };

  const handleChange = (e) => {
    setResumeData({...resumeData, [e.target.name]: e.target.value});
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setSaving(true);
    try {
      await onSave(resumeData);
    } catch (error) {
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ResumeContext.Provider
        value={{
          resumeData,
          setResumeData,
          handleProfilePicture,
          handleChange,
        }}
      >
        {/* Header with navigation and actions */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resumes
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {initialData ? 'Edit Resume' : 'Create New Resume'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Resume'}
              </button>
              <Print />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex gap-4 justify-evenly max-w-7xl mx-auto h-[calc(100vh-120px)]">
          {!formClose && (
            <Form/>
          )}
          <Preview/>
        </div>
        <FormCloseOpenBtn formClose={formClose} setFormClose={setFormClose}/>
      </ResumeContext.Provider>
    </>
  );
}
export {ResumeContext};
