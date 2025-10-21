"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ImageUpload({
  value = "",
  onChange,
  placeholder = "Click to upload image",
  accept = "image/*",
  multiple = false,
  maxFiles = 1,
  className = "",
  purpose = "generic",
  showPreview = true,
  previewSize = "w-20 h-20",
  disabled = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    const filesToUpload = Array.from(files).slice(0, maxFiles);
    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select an image file');
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("purpose", purpose);

        const response = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (multiple) {
        onChange([...(Array.isArray(value) ? value : []), ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    handleFileUpload(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = (index = null) => {
    if (multiple && Array.isArray(value)) {
      if (index !== null) {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
      } else {
        onChange([]);
      }
    } else {
      onChange("");
    }
  };

  const openFileDialog = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const currentValue = Array.isArray(value) ? value : (value ? [value] : []);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isUploading ? "opacity-75" : ""}
        `}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-600">{placeholder}</p>
            {multiple && (
              <p className="text-xs text-gray-500">
                Max {maxFiles} file{maxFiles > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Preview Images */}
      {showPreview && currentValue.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {currentValue.map((url, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className={`${previewSize} object-cover rounded-lg border shadow-sm`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(multiple ? index : null);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Image Count */}
      {multiple && currentValue.length > 0 && (
        <p className="text-xs text-gray-500">
          {currentValue.length} image{currentValue.length !== 1 ? "s" : ""} uploaded
        </p>
      )}
    </div>
  );
}
