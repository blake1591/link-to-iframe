// Define the currentUrl variable globally and initialize it
let currentUrl = "";
const iframe = document.getElementById('myIframe');

// Function to add "https://" if not present
function ensureHttps(url) {
    if (url.startsWith("www.") && !url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
    }
    return url;
}

// Helper function to extract URL from the query parameter
function getUrlFromLocation() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('url');
}

// Function to handle iframe navigation
function loadIframe(url) {
    const ensuredUrl = ensureHttps(url);
    iframe.src = ensuredUrl;
}

// Event listener for window load
window.addEventListener('load', () => {
    console.log('loaded!');
    if (currentUrl) iframe.src = currentUrl;
    // Load URL from location on page load if available
    const initialUrl = getUrlFromLocation();
    if (initialUrl) loadIframe(initialUrl);
});
