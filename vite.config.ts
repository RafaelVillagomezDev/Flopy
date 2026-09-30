import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@assets': path.resolve(import.meta.dirname, './src/assets'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@modules': path.resolve(import.meta.dirname, './src/modules'),
      '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
      '@services': path.resolve(import.meta.dirname, './src/services'),
      '@store': path.resolve(import.meta.dirname, './src/store'),
      '@types': path.resolve(import.meta.dirname, './src/types'),
      '@utils': path.resolve(import.meta.dirname, './src/utils'),

    },
  },
  

})
