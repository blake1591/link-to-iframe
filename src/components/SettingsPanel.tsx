import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Download, Info, Save, Sun, Moon, AlertCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { downloadPage, openInNewTab } from '../utils/download';

interface SettingsPanelProps {
  currentUrl: string | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'view' | 'download' | 'about'>('theme');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const togglePanel = () => {
    setIsOpen(!isOpen);
    setDownloadError(null); // Clear any error when closing/opening panel
  };

  const handleDownload = async () => {
    if (!currentUrl) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    
    try {
      // Simulate download progress
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 20);
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
      await downloadPage(currentUrl, (progress) => {
        if (progress >= 100) {
          clearInterval(interval);
        }
      });
      
      setDownloadProgress(100);
      
      // Reset after completed
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError(
        'Download failed. This website may block downloads due to security restrictions (CORS). Try using "Open in New Tab" instead.'
      );
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleOpenBlank = () => {
    if (!currentUrl) return;
    openInNewTab(currentUrl);
  };

  return (
    <>
      {/* Settings toggle button */}
      <button
        onClick={togglePanel}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        aria-label="Open settings"
      >
        <SettingsIcon size={24} />
      </button>

      {/* Settings panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-full bg-white dark:bg-gray-800 shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Settings</h2>
          <button
            onClick={togglePanel}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors duration-200"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
          {(
            [
              { id: 'theme', icon: <Sun size={16} /> },
              { id: 'view', icon: <Save size={16} /> },
              { id: 'download', icon: <Download size={16} /> },
              { id: 'about', icon: <Info size={16} /> },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-500 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              aria-selected={activeTab === tab.id}
            >
              <div className="flex items-center justify-center">
                {tab.icon}
                <span className="ml-1 capitalize">{tab.id}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'theme' && (
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Appearance</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`w-full py-2 px-3 flex items-center rounded-md ${
                    theme === 'light'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  <Sun size={18} className="mr-2" />
                  Light Mode
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`w-full py-2 px-3 flex items-center rounded-md ${
                    theme === 'dark'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  <Moon size={18} className="mr-2" />
                  Dark Mode
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`w-full py-2 px-3 flex items-center rounded-md ${
                    theme === 'system'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors duration-200`}
                >
                  <SettingsIcon size={18} className="mr-2" />
                  System Default
                </button>
              </div>
            </div>
          )}

          {activeTab === 'view' && (
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">View Options</h3>
              <div className="space-y-3">
                <button
                  onClick={handleOpenBlank}
                  disabled={!currentUrl}
                  className={`w-full py-2 px-3 rounded-md ${
                    !currentUrl
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                  } transition-colors duration-200`}
                >
                  Open in New Tab
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Opens the current URL in a new browser tab using about:blank for additional privacy.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'download' && (
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Download Options</h3>
              <div className="space-y-3">
                {downloadError && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-start">
                    <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{downloadError}</p>
                  </div>
                )}
                
                <button
                  onClick={handleDownload}
                  disabled={!currentUrl || isDownloading}
                  className={`w-full py-2 px-3 rounded-md ${
                    !currentUrl || isDownloading
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                  } transition-colors duration-200`}
                >
                  {isDownloading ? 'Downloading...' : 'Download Page'}
                </button>
                
                {isDownloading && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Downloads the current page as an HTML file with all resources embedded. Note: Some websites may block downloads due to security restrictions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div>
              <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">About</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Link to Iframe is a modern application designed to safely view web content through an iframe.
                </p>
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-4">Features:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Secure iframe sandboxing</li>
                  <li>URL validation</li>
                  <li>Light/dark themes</li>
                  <li>Page download functionality</li>
                  <li>Mobile responsive design</li>
                </ul>
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-4">Version:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background overlay when panel is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={togglePanel}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default SettingsPanel;