/**
 * Validates if the provided string is a properly formatted URL
 * @param url The URL string to validate
 * @returns true if valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
};

/**
 * Ensures the URL has a proper protocol
 * @param url The URL string to process
 * @returns A URL with the http:// protocol added if missing
 */
export const ensureProtocol = (url: string): string => {
  if (!url) return '';
  
  const hasProtocol = /^(http|https):\/\//.test(url);
  
  if (!hasProtocol) {
    return `https://${url}`;
  }
  
  return url;
};

/**
 * Extracts the domain name from a URL
 * @param url The URL to extract the domain from
 * @returns The domain name
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    // Return a safe fallback if URL parsing fails
    return 'unknown-domain';
  }
};
