'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const lastScrollY = useRef(0);

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

  // Auto-hide functionality
  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false);
        }
      }, 3000); // Hide after 3 seconds of inactivity
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      
      if (scrollDelta > 10) { // Show on scroll
        setIsVisible(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (!isHovered) {
            setIsVisible(false);
          }
        }, 2000);
      }
      
      lastScrollY.current = currentScrollY;
    };

    const handleTouchStart = () => {
      setIsVisible(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false);
        }
      }, 3000);
    };

    // Set initial timeout
    timeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      }
    }, 3000);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered]);

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        setIsVisible(false);
      }
    }, 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed left-4 top-20 z-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isMinimized ? 'w-12 h-12' : 'w-16 md:w-20'
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0.3,
          x: 0
        }}
        transition={{ 
          duration: 0.5,
          ease: "easeInOut"
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          setIsVisible(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 1000);
        }}
        onTouchStart={() => {
          setIsVisible(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
      >
        {/* Minimize/Maximize Button */}
        <button
          onClick={handleMinimizeToggle}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-all duration-200 z-50"
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? "🔽" : "🔼"}
        </button>

        {isMinimized ? (
          // Minimized state - just show current step
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 mx-auto">
                <span className="text-xs">{editorSteps[currentStepIndex]?.icon}</span>
              </div>
              <div className="text-[8px] font-medium text-gray-900 dark:text-white">
                {currentStepIndex + 1}/{editorSteps.length}
              </div>
            </div>
          </div>
        ) : (
          // Expanded state - show full navigation
          <div className="p-3">
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
        )}
      </motion.div>
    </AnimatePresence>
  );
}
