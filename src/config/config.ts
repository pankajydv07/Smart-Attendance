// API Configuration
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://smart-attendance-qk5b.onrender.com/api',
  environment: import.meta.env.VITE_APP_ENV || 'production',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;