import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png}'],
      },
      manifest: {
        name: 'O Impostor',
        short_name: 'O Impostor',
        description: 'Uma descrição do meu aplicativo Vue',
        icons: [
          {
            src: '/icons/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        start_url: '.',
        background_color: '#ffffff',
        theme_color: '#FFFFFF',
        display: 'standalone',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
