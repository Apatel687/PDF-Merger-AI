import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-seo-files',
      writeBundle() {
        const fs = require('fs')
        try {
          fs.copyFileSync('public/sitemap.xml', 'dist/sitemap.xml')
          fs.copyFileSync('public/robots.txt', 'dist/robots.txt')
          console.log('✅ SEO files copied successfully')
        } catch (error) {
          console.error('❌ SEO copy failed:', error)
        }
      }
    }
  ],
  base: '/',
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    assetsDir: 'assets',
    copyPublicDir: true
  },
  // Ensure SPA routing works
  preview: {
    port: 4173,
    strictPort: true
  }
})