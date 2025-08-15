import { useEffect } from 'react';

// Generate a unique session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  
  let sessionId = localStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
};

// Track events to our analytics API
const trackEvent = async (eventType, data = {}) => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) return;

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        data,
        timestamp: new Date().toISOString(),
        sessionId,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof window !== 'undefined' ? document.referrer : ''
      })
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Track page views
export const trackPageView = (pageName, additionalData = {}) => {
  trackEvent('page_view', {
    page: pageName,
    ...additionalData
  });
};

// Track portfolio interactions
export const trackPortfolioInteraction = (action, portfolioId, additionalData = {}) => {
  trackEvent('portfolio_interaction', {
    action,
    portfolioId,
    ...additionalData
  });
};

// Track resume downloads
export const trackResumeDownload = (portfolioId, format = 'pdf') => {
  trackEvent('resume_download', {
    portfolioId,
    format
  });
};

// Track contact form submissions
export const trackContactSubmit = (portfolioId, formData = {}) => {
  trackEvent('contact_submit', {
    portfolioId,
    formData: {
      hasEmail: !!formData.email,
      hasMessage: !!formData.message,
      hasName: !!formData.name
    }
  });
};

// Track social link clicks
export const trackSocialClick = (portfolioId, platform) => {
  trackEvent('social_click', {
    portfolioId,
    platform
  });
};

// Track time on page
export const trackTimeOnPage = (pageName, timeSpent) => {
  trackEvent('time_on_page', {
    page: pageName,
    timeSpent
  });
};

// Track scroll depth
export const trackScrollDepth = (pageName, scrollPercentage) => {
  trackEvent('scroll_depth', {
    page: pageName,
    scrollPercentage
  });
};

// Analytics Hook for automatic tracking
export const useAnalytics = (pageName, additionalData = {}) => {
  useEffect(() => {
    // Track page view on mount
    trackPageView(pageName, additionalData);

    // Track time on page
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackTimeOnPage(pageName, timeSpent);
    };

    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        // Track at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(maxScroll)) {
          trackScrollDepth(pageName, maxScroll);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
      
      // Track final time on page
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackTimeOnPage(pageName, timeSpent);
    };
  }, [pageName, additionalData]);
};

// Analytics Provider Component
export const AnalyticsProvider = ({ children }) => {
  useEffect(() => {
    // Initialize analytics on app load
    trackEvent('app_load', {
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      screenResolution: typeof window !== 'undefined' ? `${screen.width}x${screen.height}` : '',
      language: typeof window !== 'undefined' ? navigator.language : '',
      timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : ''
    });
  }, []);

  return children;
};

export default {
  trackEvent,
  trackPageView,
  trackPortfolioInteraction,
  trackResumeDownload,
  trackContactSubmit,
  trackSocialClick,
  trackTimeOnPage,
  trackScrollDepth,
  useAnalytics,
  AnalyticsProvider
};
