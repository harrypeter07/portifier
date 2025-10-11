// Fix for React DevTools semver validation error
// This prevents the "Invalid argument not valid semver" error

if (typeof window !== 'undefined') {
  // Check if React DevTools is causing issues
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Filter out React DevTools semver errors
    if (message.includes('Invalid argument not valid semver') || 
        message.includes('validateAndParse') ||
        message.includes('esm_compareVersions')) {
      // Silently ignore these errors
      return;
    }
    
    // Log other errors normally
    originalConsoleError.apply(console, args);
  };
  
  // Also handle uncaught errors
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('Invalid argument not valid semver')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('Invalid argument not valid semver')) {
      event.preventDefault();
      return false;
    }
  });
}
