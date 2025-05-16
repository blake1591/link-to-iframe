import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface IframeViewerProps {
  url: string | null;
}

interface ErrorState {
  message: string;
  code?: string;
  retry?: boolean;
}

const IframeViewer: React.FC<IframeViewerProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const retryCount = useRef<number>(0);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    setError(null);
    retryCount.current = 0;
  }, [url]);

  const getErrorMessage = (error: any): ErrorState => {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        message: 'Unable to connect to the website. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
        retry: true
      };
    }

    if (error.name === 'SecurityError') {
      return {
        message: 'This website cannot be displayed due to security restrictions.',
        code: 'SECURITY_ERROR'
      };
    }

    if (error.name === 'AbortError') {
      return {
        message: 'The request was cancelled. Please try again.',
        code: 'TIMEOUT_ERROR',
        retry: true
      };
    }

    return {
      message: 'An unexpected error occurred while loading the page. Please try again.',
      code: 'UNKNOWN_ERROR',
      retry: true
    };
  };

  const handleLoad = () => {
    setIsLoading(false);
    retryCount.current = 0;
  };

  const handleError = (event: Event | string) => {
    setIsLoading(false);
    const errorState = getErrorMessage(event);
    setError(errorState);
  };

  const handleRetry = () => {
    if (!url || retryCount.current >= 3) return;
    
    retryCount.current += 1;
    setIsLoading(true);
    setError(null);
    
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  if (!url) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Enter a URL to get started
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Type a website URL in the input field above and click the load button to view it securely in this iframe viewer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-black transition-colors duration-300">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-10">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-white dark:bg-black z-10">
          <div className="max-w-md p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center mb-4">
              <AlertCircle className="text-red-500 dark:text-red-400 mr-2" size={24} />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Error</h3>
            </div>
            <p className="text-red-600 dark:text-red-300 mb-4">{error.message}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setError(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-300"
              >
                Dismiss
              </button>
              {error.retry && retryCount.current < 3 && (
                <button 
                  onClick={handleRetry}
                  className="px-4 py-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={url}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0 transition-opacity duration-500"
        style={{ opacity: isLoading ? 0 : 1 }}
        onLoad={handleLoad}
        onError={(e) => handleError(e)}
        title="Web Content Viewer"
      />
    </div>
  );
};

export default IframeViewer;