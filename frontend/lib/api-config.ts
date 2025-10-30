// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function untuk build full URL
export const getApiUrl = (path: string = '') => {
  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_URL}${cleanPath ? `/${cleanPath}` : ''}`;
};

// Short URL untuk copy/display
export const getShortUrl = (shortCode: string) => {
  return `${API_URL}/${shortCode}`;
};
