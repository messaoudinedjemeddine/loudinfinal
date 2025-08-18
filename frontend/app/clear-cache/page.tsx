'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearCachePage() {
  const router = useRouter();

  useEffect(() => {
    const clearCache = () => {
      console.log('🧹 Clearing frontend cache...');
      
      // Clear localStorage
      localStorage.clear();
      console.log('✅ localStorage cleared');
      
      // Clear sessionStorage
      sessionStorage.clear();
      console.log('✅ sessionStorage cleared');
      
      // Clear any cached data in memory
      if (window.caches) {
        caches.keys().then(function(names) {
          for (let name of names) {
            caches.delete(name);
          }
          console.log('✅ Cache storage cleared');
        });
      }
      
      // Show success message
      alert('Cache cleared successfully! The page will now reload with fresh data.');
      
      // Force page reload to get fresh data
      window.location.href = '/';
    };

    clearCache();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">Clearing Cache</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we clear your cache and reload the page with fresh data...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
