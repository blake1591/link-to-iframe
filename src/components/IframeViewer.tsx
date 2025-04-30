import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface IframeViewerProps {
  url: string | null;
}

const IframeViewer: React.FC<IframeViewerProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    setError(null);
  }, [url]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load the page. Please check the URL and try again.');
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
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
            >
              Dismiss
            </button>
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
        onError={handleError}
        title="Web Content Viewer"
      />
    </div>
  );
};

export default IframeViewer;