import React from "react";

export default function CustomPortfolioLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-bounce rounded-full h-14 w-14 border-4 border-dashed border-purple-600 mx-auto mb-4 shadow-lg bg-white/80 dark:bg-gray-900/80"></div>
        <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">Hang tight! Your portfolio is loading...</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This is a custom loading screen. You can select it in the customize tab!</p>
      </div>
    </div>
  );
} 