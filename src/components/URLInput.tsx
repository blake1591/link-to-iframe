import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';

interface URLInputProps {
  onLoadURL: (url: string) => void;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

const URLInput: React.FC<URLInputProps> = ({ onLoadURL }) => {
  const [url, setUrl] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateURL = async (input: string): Promise<ValidationResult> => {
    // Basic URL format validation
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(input)) {
      return {
        isValid: false,
        message: 'Please enter a valid URL starting with http:// or https://'
      };
    }

    // Check for common URL patterns
    const commonPatterns = {
      localhost: /^https?:\/\/localhost/,
      ip: /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
      domain: /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
    };

    if (!Object.values(commonPatterns).some(pattern => pattern.test(input))) {
      return {
        isValid: false,
        message: 'Invalid URL format. Please check the URL and try again.'
      };
    }

    try {
      // Check if the URL is reachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(input, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // This allows checking URLs without CORS issues
      });

      clearTimeout(timeoutId);
      return { isValid: true };
    } catch (error) {
      // If the error is due to CORS, we still consider it valid as it might work in the iframe
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return { isValid: true };
      }

      return {
        isValid: false,
        message: 'Unable to connect to this URL. Please check if the website is accessible.'
      };
    }
  };

  useEffect(() => {
    const validateInput = async () => {
      if (url === '') {
        setValidation(null);
        return;
      }

      const result = await validateURL(url);
      setValidation(result);
    };

    const debounceTimeout = setTimeout(validateInput, 500);
    return () => clearTimeout(debounceTimeout);
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation?.isValid) return;
    
    setIsLoading(true);
    
    try {
      const finalValidation = await validateURL(url);
      if (finalValidation.isValid) {
        onLoadURL(url);
      } else {
        setValidation(finalValidation);
      }
    } catch (error) {
      setValidation({
        isValid: false,
        message: 'Failed to validate URL. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto"
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
            validation?.isValid
              ? 'border-green-500 focus:ring-green-200'
              : validation?.isValid === false
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-800'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          aria-label="Website URL"
        />
        <button
          type="submit"
          disabled={!validation?.isValid || isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md transition-all duration-300 ${
            !validation?.isValid || isLoading
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
      
      {validation?.isValid === false && validation.message && (
        <div className="absolute mt-2 flex items-start gap-2 text-sm text-red-500 dark:text-red-400">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{validation.message}</span>
        </div>
      )}
    </form>
  );
};

export default URLInput;