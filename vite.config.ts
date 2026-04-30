import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replaceAll('\\', '/');

            if (!normalizedId.includes('/node_modules/')) {
              return undefined;
            }

            if (
              normalizedId.includes('/node_modules/react/') ||
              normalizedId.includes('/node_modules/react-dom/') ||
              normalizedId.includes('/node_modules/react-router-dom/')
            ) {
              return 'vendor-react';
            }

            if (normalizedId.includes('/node_modules/motion/')) {
              return 'vendor-motion';
            }

            if (
              normalizedId.includes('/node_modules/firebase/') ||
              normalizedId.includes('/node_modules/@firebase/')
            ) {
              if (normalizedId.includes('/auth/')) {
                return 'vendor-firebase-auth';
              }

              if (normalizedId.includes('/firestore/')) {
                return 'vendor-firebase-firestore';
              }

              return 'vendor-firebase-core';
            }

            if (
              normalizedId.includes('/node_modules/@dnd-kit/') ||
              normalizedId.includes('/node_modules/@tiptap/')
            ) {
              return 'vendor-admin-ui';
            }

            if (
              normalizedId.includes('/node_modules/@base-ui/') ||
              normalizedId.includes('/node_modules/@radix-ui/') ||
              normalizedId.includes('/node_modules/lucide-react/') ||
              normalizedId.includes('/node_modules/sonner/')
            ) {
              return 'vendor-ui';
            }

            if (
              normalizedId.includes('/node_modules/i18next') ||
              normalizedId.includes('/node_modules/react-i18next/')
            ) {
              return 'vendor-i18n';
            }

            return undefined;
          },
        },
      },
    },
  };
});
