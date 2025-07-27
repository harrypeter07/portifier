import React from "react";

export default function Modal({
  open,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showCancel = false,
  error = false,
  children,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative animate-in fade-in slide-in-from-top-5">
        <h3 className={`text-lg font-bold mb-2 ${error ? 'text-red-600' : 'text-blue-700 dark:text-blue-200'}`}>{title}</h3>
        <div className="mb-4 text-gray-700 dark:text-gray-200 text-base">
          {message}
          {children}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {showCancel && (
            <button
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          <button
            className={`px-4 py-2 rounded ${error ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} font-semibold`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 