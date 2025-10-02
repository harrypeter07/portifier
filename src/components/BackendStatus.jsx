'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, RefreshCw, Server, Database } from 'lucide-react';
import LoadingSpinner from './common/LoadingSpinner';

const BackendStatus = () => {
  const [status, setStatus] = useState({
    connected: false,
    loading: true,
    error: null,
    lastChecked: null,
    details: null
  });

  const checkBackendStatus = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      // Try multiple backend URLs
      const backendUrls = [
        process.env.NEXT_PUBLIC_API_URL,
        'http://localhost:5000',
        'http://127.0.0.1:5000',
        'https://127.0.0.1:5000'
      ].filter(Boolean);
      
      let lastError = null;
      
      for (const backendUrl of backendUrls) {
        try {
          console.log(`🔍 Trying backend URL: ${backendUrl}`);
          const response = await fetch(`${backendUrl}/api/health`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setStatus({
              connected: true,
              loading: false,
              error: null,
              lastChecked: new Date().toLocaleTimeString(),
              details: { ...data, backendUrl }
            });
            console.log('✅ Backend connected successfully:', data);
            return; // Success, exit the function
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (urlError) {
          console.log(`❌ Failed to connect to ${backendUrl}:`, urlError.message);
          lastError = urlError;
          continue; // Try next URL
        }
      }
      
      // If we get here, all URLs failed
      throw lastError || new Error('All backend URLs failed');
      
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      setStatus({
        connected: false,
        loading: false,
        error: error.message,
        lastChecked: new Date().toLocaleTimeString(),
        details: null
      });
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Backend Status
          </h3>
        </div>
        <button
          onClick={checkBackendStatus}
          disabled={status.loading}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 ${status.loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {status.loading ? (
            <>
              <LoadingSpinner 
                message="Checking connection..." 
                size="small"
                showMessage={true}
                inline={true}
              />
            </>
          ) : status.connected ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                Connected successfully
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">
                Connection failed
              </span>
            </>
          )}
        </div>

        {/* Error Details */}
        {status.error && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {status.error}
          </div>
        )}

        {/* Database Status */}
        {status.details?.database && (
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Database: {status.details.database.connection_status || 'Unknown'}
            </span>
          </div>
        )}

        {/* Last Checked */}
        {status.lastChecked && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last checked: {status.lastChecked}
          </div>
        )}

        {/* API Details */}
        {status.details && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            API: {status.details.message || 'Running'}
            {status.details.backendUrl && (
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Connected to: {status.details.backendUrl}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendStatus;
