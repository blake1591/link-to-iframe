/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme
        'light-background': '#ffffff',
        'light-text': '#333333',
        'light-accent': '#007AFF',
        
        // Dark theme
        'dark-background': '#1A1A1A',
        'dark-text': '#E0E0E0',
        'dark-accent': '#0A84FF',
        
        // Status colors
        'success': '#34C759',
        'warning': '#FF9500',
        'error': '#FF3B30',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};