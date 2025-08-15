'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const editorSteps = [
  { 
    href: "/editor", 
    label: "Upload", 
    icon: "📄",
    description: "Upload resume"
  },
  { 
    href: "/editor/edit-resume", 
    label: "Edit", 
    icon: "✏️",
    description: "Edit details"
  },
  { 
    href: "/editor/customize", 
    label: "Customize", 
    icon: "🎨",
    description: "Choose templates"
  },
  { 
    href: "/preview/live", 
    label: "Preview", 
    icon: "👁️",
    description: "Preview portfolio"
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
    <div className="fixed left-4 top-20 z-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 w-16 md:w-20">
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="text-center mb-2">
          <div className="text-xs font-medium text-gray-900 dark:text-white">
            {currentStepIndex + 1}/{editorSteps.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <motion.div
            className="bg-blue-600 h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / editorSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Navigation - Vertical */}
      <div className="flex flex-col space-y-2">
        {editorSteps.map((step, index) => {
          const isActive = pathname === step.href;
          const isCompleted = index < currentStepIndex;
          const isClickable = index <= currentStepIndex + 1;

          return (
            <Link
              key={step.href}
              href={step.href}
              className={`group flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
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
              title={`${step.label}: ${step.description}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                  ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {isCompleted ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <span className="text-xs">{step.icon}</span>
                )}
              </div>
              <span className="text-[10px] font-medium text-center leading-tight">{step.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
