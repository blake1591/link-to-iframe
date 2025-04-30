import React, { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface URLInputProps {
  onLoadURL: (url: string) => void;
}

const URLInput: React.FC<URLInputProps> = ({ onLoadURL }) => {
  const [url, setUrl] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // URL validation regex pattern
  const urlPattern = /^(http|https):\/\/[^ "]+$/;

  useEffect(() => {
    if (url === '') {
      setIsValid(null);
      return;
    }
    setIsValid(urlPattern.test(url));
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    setIsLoading(true);
    
    // Simulate loading state for better UX
    setTimeout(() => {
      onLoadURL(url);
      setIsLoading(false);
    }, 500);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL (https://example.com)"
          className={`w-full h-10 pl-10 pr-16 rounded-lg border transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 ${
            isValid === true
              ? 'border-green-500 focus:ring-green-200'
              : isValid === false
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-800'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          aria-label="Website URL"
        />
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all duration-300 ${
            !isValid || isLoading
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
          }`}
          aria-label="Load website"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
          ) : (
            <ArrowRight size={20} />
          )}
        </button>
      </div>
      
      {isValid === false && (
        <p className="absolute mt-1 text-sm text-red-500 dark:text-red-400">
          Please enter a valid URL starting with http:// or https://
        </p>
      )}
    </form>
  );
};

export default URLInput;