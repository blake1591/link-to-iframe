import React, { useState } from 'react';
import { ExternalLink, Download, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import URLInput from './components/URLInput';
import IframeViewer from './components/IframeViewer';
import ThemeToggle from './components/ThemeToggle';
import SettingsPanel from './components/SettingsPanel';
import { ThemeProvider } from './hooks/useTheme';
import { openInNewTab, downloadPage } from './utils/download';

function App() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLoadURL = (url: string) => {
    setCurrentUrl(url);
  };

  const handleOpenInBlank = () => {
    if (currentUrl) {
      openInNewTab(currentUrl);
    }
  };

  const handleDownload = async () => {
    if (!currentUrl || isDownloading) return;
    
    setIsDownloading(true);
    try {
      await downloadPage(currentUrl, () => {});
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleFullscreen = () => {
    const iframeContainer = document.getElementById('iframe-container');
    if (!iframeContainer) return;

    if (!document.fullscreenElement) {
      iframeContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className={`bg-white dark:bg-gray-950 shadow-sm z-10 transition-all duration-300 ${isFullscreen ? 'hidden' : ''}`}>
          <div className="container mx-auto px-4 h-16 flex items-center gap-4">
            <div className="flex flex-col -ml-4">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                linktoiframe2.netlify.app
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                or linktoiframe3.netlify.app
              </span>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Links <ChevronDown size={16} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg z-20 py-1">
                    <button
                      onClick={() => {
                        handleLoadURL('https://sz-games.github.io');
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Games
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1">
              <URLInput onLoadURL={handleLoadURL} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenInBlank}
                disabled={!currentUrl}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
                title="Open current page in about:blank tab"
              >
                <ExternalLink size={20} />
              </button>
              <button
                onClick={handleDownload}
                disabled={!currentUrl || isDownloading}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700"
                title="Download current page (Experimental - may not work for all sites)"
              >
                {isDownloading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                ) : (
                  <Download size={20} />
                )}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-grow relative">
          <div id="iframe-container" className="absolute inset-0">
            <IframeViewer url={currentUrl} />
          </div>
        </main>

        <button
          onClick={toggleFullscreen}
          className="fixed bottom-4 left-4 p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>

        <SettingsPanel currentUrl={currentUrl} />
      </div>
    </ThemeProvider>
  );
}

export default App;