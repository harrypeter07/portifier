'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const editorSteps = [
  { 
    href: "/editor", 
    label: "Upload Resume", 
    icon: "📄",
    description: "Start by uploading your resume"
  },
  { 
    href: "/editor/edit-resume", 
    label: "Edit Details", 
    icon: "✏️",
    description: "Review and edit your information"
  },
  { 
    href: "/editor/customize", 
    label: "Customize", 
    icon: "🎨",
    description: "Choose templates and components"
  },
  { 
    href: "/preview/live", 
    label: "Preview", 
    icon: "👁️",
    description: "Preview your portfolio"
  }
];

export default function EditorNavbar() {
  const pathname = usePathname();

  // Don't show on public portfolio pages
  if (/^\/[a-zA-Z0-9_-]+$/.test(pathname) && 
      !['/dashboard', '/editor', '/settings', '/auth', '/api', '/preview'].some(prefix => pathname.startsWith(prefix))) {
    return null;
  }

  // Only show on editor-related pages
  if (!pathname.startsWith('/editor') && !pathname.startsWith('/preview')) {
    return null;
  }

  const currentStepIndex = editorSteps.findIndex(step => pathname === step.href);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Portfolio Creation
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStepIndex + 1} of {editorSteps.length}
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIndex + 1) / editorSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between overflow-x-auto">
            {editorSteps.map((step, index) => {
              const isActive = pathname === step.href;
              const isCompleted = index < currentStepIndex;
              const isClickable = index <= currentStepIndex + 1; // Allow going back or one step forward

              return (
                <div key={step.href} className="flex items-center">
                  <Link
                    href={step.href}
                    className={`group flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 min-w-[120px] ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200"
                        : isCompleted
                        ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                        : isClickable
                        ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!isClickable) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}>
                      {isCompleted ? (
                        <span className="text-sm">✓</span>
                      ) : (
                        <span className="text-sm">{step.icon}</span>
                      )}
                    </div>
                    <span className="text-xs font-medium text-center">{step.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 hidden sm:block">
                      {step.description}
                    </span>
                  </Link>
                  
                  {/* Connector line */}
                  {index < editorSteps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 mx-2 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
