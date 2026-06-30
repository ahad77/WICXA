// Central API configuration.
// Override per-environment by setting VITE_API_URL in a .env file.
// Falls back to the production backend so existing deployments keep working.
export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://wicxa.onrender.com';

// Helper to build a full API endpoint URL.
export const apiUrl = (path: string): string =>
  `${API_BASE_URL}/${path.replace(/^\//, '')}`;
