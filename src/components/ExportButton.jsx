"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ExportButton({ portfolioId, username, className = "" }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/portfolio/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId,
          format: exportFormat
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Export failed');
      }

      // For now, we'll use html2pdf.js for client-side PDF generation
      // In a production environment, you might want server-side PDF generation
      if (exportFormat === 'pdf') {
        await generatePDF(data.portfolio);
      } else {
        // Handle other formats (PNG, etc.)
        console.log('Other formats not yet implemented');
      }

    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export portfolio: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDF = async (portfolioData) => {
    // This is a basic implementation using html2pdf.js
    // You would need to install: npm install html2pdf.js
    
    try {
      // Create a temporary div with portfolio content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = generatePortfolioHTML(portfolioData);
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Use html2pdf.js to generate PDF
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: 1,
        filename: `${portfolioData.username}-portfolio.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(tempDiv).save();
      
      // Clean up
      document.body.removeChild(tempDiv);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      // Fallback: open in new window for printing
      const printWindow = window.open(`/${portfolioData.username}`, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const generatePortfolioHTML = (portfolio) => {
    const { portfolioData, content } = portfolio;
    const personal = portfolioData?.personal || {};
    const about = portfolioData?.about || {};
    const experience = portfolioData?.experience || {};
    const education = portfolioData?.education || {};
    const skills = portfolioData?.skills || {};
    const projects = portfolioData?.projects || {};

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          ${personal.firstName || ''} ${personal.lastName || ''}
        </h1>
        
        <p style="color: #666; font-size: 18px; margin: 10px 0;">
          ${personal.title || ''}
        </p>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #333;">About</h2>
          <p>${about.summary || ''}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #333;">Experience</h2>
          ${experience.jobs?.map(job => `
            <div style="margin: 15px 0; padding: 10px; border-left: 3px solid #007bff;">
              <h3 style="margin: 0;">${job.title || ''}</h3>
              <p style="color: #666; margin: 5px 0;">${job.company || ''}</p>
              <p style="margin: 5px 0;">${job.description || ''}</p>
            </div>
          `).join('') || ''}
        </div>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #333;">Education</h2>
          ${education.degrees?.map(degree => `
            <div style="margin: 15px 0;">
              <h3 style="margin: 0;">${degree.degree || ''}</h3>
              <p style="color: #666; margin: 5px 0;">${degree.institution || ''}</p>
            </div>
          `).join('') || ''}
        </div>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #333;">Skills</h2>
          <p><strong>Technical:</strong> ${skills.technical?.join(', ') || ''}</p>
          <p><strong>Soft Skills:</strong> ${skills.soft?.join(', ') || ''}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #333;">Projects</h2>
          ${projects.items?.map(project => `
            <div style="margin: 15px 0; padding: 10px; border: 1px solid #ddd;">
              <h3 style="margin: 0;">${project.title || ''}</h3>
              <p style="margin: 5px 0;">${project.description || ''}</p>
            </div>
          `).join('') || ''}
        </div>
        
        <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="text-align: center; color: #666;">
            Generated from ${window.location.origin}/${portfolio.username}
          </p>
        </div>
      </div>
    `;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        disabled={isExporting}
      >
        <option value="pdf">PDF</option>
        <option value="png">PNG</option>
        <option value="html">HTML</option>
      </select>
      
      <motion.button
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExporting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Exporting...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
