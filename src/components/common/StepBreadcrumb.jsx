'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const steps = [
  { href: "/editor", label: "Upload", icon: "📄" },
  { href: "/editor/edit-resume", label: "Edit", icon: "✏️" },
  { href: "/editor/customize", label: "Customize", icon: "🎨" },
  { href: "/preview/live", label: "Preview", icon: "👁️" }
];

export default function StepBreadcrumb() {
  const pathname = usePathname();

  // Only show on editor-related pages
  if (!pathname.startsWith('/editor') && !pathname.startsWith('/preview')) {
    return null;
  }

  const currentStepIndex = steps.findIndex(step => pathname === step.href);

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-sm">
          {steps.map((step, index) => {
            const isActive = pathname === step.href;
            const isCompleted = index < currentStepIndex;
            const isClickable = index <= currentStepIndex + 1;

            return (
              <div key={step.href} className="flex items-center">
                <Link
                  href={step.href}
                  className={`flex items-center space-x-1 px-2 py-1 rounded transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-medium"
                      : isCompleted
                      ? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                      : isClickable
                      ? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (!isClickable) {
                      e.preventDefault();
                    }
                  }}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </Link>
                
                {index < steps.length - 1 && (
                  <span className="text-gray-400 dark:text-gray-500 mx-1">/</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
