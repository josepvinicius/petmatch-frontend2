import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // 🔥 ADICIONE ESTAS CONFIGURAÇÕES PARA O VERCEL:
  base: '/', // Importante para o Vercel
  build: {
    outDir: 'dist',
    sourcemap: false, // Desative em produção para build mais rápido
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['react-hot-toast', 'axios'],
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Aumenta o limite de warning
  },
  // Configuração específica para preview (teste local)
  preview: {
    port: 4173,
    host: true,
  }
});
