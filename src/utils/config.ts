export const config = {
  // URLs
  apiUrl: import.meta.env.VITE_API_URL,
  
  // Feature Flags
  useMocks: import.meta.env.VITE_ENABLE_MOCKS === 'true',
  
  // Entornos de Vite (Vite nos regala estas variables booleanas)
  isDev: import.meta.env.DEV,   // true en npm run dev
  isProd: import.meta.env.PROD, // true en npm run build
};