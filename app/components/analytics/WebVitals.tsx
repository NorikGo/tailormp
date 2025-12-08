'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

/**
 * Web Vitals Component
 * Tracks Core Web Vitals and sends them to Vercel Analytics
 *
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }

    // Analytics will automatically track these via Speed Insights
    // But we can add custom logic here if needed

    // Example: Send to custom analytics endpoint
    // if (metric.rating === 'poor') {
    //   fetch('/api/analytics/vitals', {
    //     method: 'POST',
    //     body: JSON.stringify(metric),
    //   });
    // }
  });

  // Optional: Track custom events
  useEffect(() => {
    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Track session duration, etc.
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
