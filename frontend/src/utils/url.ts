import { BASE_URL } from '../services/api';

/**
 * Safely resolves an asset URL (images, PDFs, documents).
 * Handles both absolute URLs (e.g. Cloudinary `https://...`) and relative paths (e.g. `/uploads/...`).
 * 
 * @param path - The URL or relative path of the asset
 * @param fallback - Optional fallback URL if path is undefined or empty
 * @returns Fully qualified URL string
 */
export const getAssetUrl = (path?: string | null, fallback: string = ''): string => {
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return fallback;
  }

  const trimmed = path.trim();

  // If already absolute or a data/blob URI, return as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Ensure clean joining with BASE_URL
  const cleanBase = BASE_URL.replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  return `${cleanBase}${cleanPath}`;
};

export default getAssetUrl;
