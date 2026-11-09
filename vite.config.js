import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'social-card.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Phae Expense Tracker',
        short_name: 'Phae',
        description: 'A private, local-first expense tracker for clear spending habits.',
        theme_color: '#1a1d29',
        background_color: '#1a1d29',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'en',
        categories: ['finance', 'productivity'],
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
