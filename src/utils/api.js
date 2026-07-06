const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
