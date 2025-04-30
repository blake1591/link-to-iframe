import { extractDomain } from './validation';

/**
 * Downloads the web page at the given URL
 * @param url The URL of the page to download
 * @param progressCallback Optional callback to track download progress
 */
export const downloadPage = async (
  url: string, 
  progressCallback?: (progress: number) => void
): Promise<void> => {
  try {
    // Start progress indication
    progressCallback?.(10);
    
    // Fetch the page content
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }
    
    progressCallback?.(50);
    
    // Get the text content of the page
    const html = await response.text();
    
    progressCallback?.(80);
    
    // Create a blob from the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    
    // Generate filename from the domain and current timestamp
    const domain = extractDomain(url);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadLink.download = `${domain}-${timestamp}.html`;
    
    // Trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Clean up the object URL
    URL.revokeObjectURL(downloadLink.href);
    
    progressCallback?.(100);
  } catch (error) {
    console.error('Error downloading page:', error);
    throw error;
  }
};

/**
 * Opens the URL in a new tab using about:blank with a full-screen iframe
 * @param url The URL to open
 */
export const openInNewTab = (url: string): void => {
  const newWindow = window.open('about:blank', '_blank');
  if (newWindow) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ㅤ</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe src="${url}" sandbox="allow-scripts allow-same-origin"></iframe>
        </body>
      </html>
    `;
    newWindow.document.write(html);
    newWindow.document.close();
  }
};
