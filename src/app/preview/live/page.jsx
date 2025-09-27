"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Preview from '@/components/Preview';
import { motion } from 'framer-motion';

// Default layout for templates (similar to editor)
const DEFAULT_LAYOUT = {
  hero: "HeroA",
  about: "AboutB", 
  experience: "ExperienceA",
  education: "EducationA",
  skills: "SkillsA",
  projects: "ShowcaseA",
  achievements: "AchievementsA",
  contact: "ContactFormA",
};

export default function LivePreviewPage() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const templateIdParam = searchParams.get('templateId');
    const dataParam = searchParams.get('data');

    if (templateIdParam) {
      setTemplateId(templateIdParam);
    }

    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setPortfolioData(decodedData);
        console.log('📊 [LIVE-PREVIEW] Loaded portfolio data:', {
          templateId: templateIdParam,
          hasData: !!decodedData,
          sections: Object.keys(decodedData || {}),
          personal: decodedData?.personal ? {
            firstName: decodedData.personal.firstName,
            lastName: decodedData.personal.lastName,
            email: decodedData.personal.email
          } : null
        });
      } catch (err) {
        console.error('❌ [LIVE-PREVIEW] Failed to parse portfolio data:', err);
        setError('Invalid portfolio data');
      }
    }

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Preview Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!templateId || !portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Preview Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Template ID or portfolio data is missing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🎨 Portfolio Preview
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Template: {templateId} | Live Preview
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-sm rounded-full">
                🔄 Live Preview
              </span>
              <button
                onClick={() => window.close()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <Preview 
            layout={DEFAULT_LAYOUT}
            content={portfolioData}
            portfolioData={portfolioData}
          />
        </motion.div>
      </div>
    </div>
  );
}