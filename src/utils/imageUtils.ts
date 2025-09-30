// Image optimization utilities
export const getOptimizedImageUrl = (
  originalUrl: string, 
  width?: number, 
  height?: number,
  quality?: number
): string => {
  // If it's already a full URL or placeholder, return as is
  if (originalUrl.startsWith('http') || originalUrl.startsWith('/placeholder')) {
    return originalUrl;
  }

  // For backend images, construct optimized URL
  const baseUrl = 'http://localhost:5000';
  const encodedPath = encodeURI(originalUrl);
  
  // For now, return the basic URL. In production, you could add query params for size optimization
  if (originalUrl.startsWith('/')) {
    return `${baseUrl}${encodedPath}`;
  }
  
  return `${baseUrl}/images/${encodedPath}`;
};

// Generate srcSet for responsive images
export const generateSrcSet = (originalUrl: string): string => {
  const baseUrl = getOptimizedImageUrl(originalUrl);
  
  // For now, return the same URL. In production, you'd generate different sizes
  return `${baseUrl} 1x, ${baseUrl} 2x`;
};

// Get thumbnail URL (smaller version for lists)
export const getThumbnailUrl = (originalUrl: string): string => {
  // For now, return the same URL. In production, you'd serve smaller thumbnails
  return getOptimizedImageUrl(originalUrl, 400, 300, 80);
};

// Get full-size URL for product details
export const getFullSizeUrl = (originalUrl: string): string => {
  return getOptimizedImageUrl(originalUrl, 800, 600, 90);
};