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
        try {
          const fs = require('fs')
          const path = require('path')
          
          // Ensure dist directory exists
          if (!fs.existsSync('dist')) {
            fs.mkdirSync('dist', { recursive: true })
          }
          
          // Copy all SEO files
          fs.copyFileSync('public/sitemap.xml', 'dist/sitemap.xml')
          fs.copyFileSync('public/robots.txt', 'dist/robots.txt')
          fs.copyFileSync('public/sitemap.txt', 'dist/sitemap.txt')
          
          // Copy .well-known directory
          if (fs.existsSync('public/.well-known')) {
            if (!fs.existsSync('dist/.well-known')) {
              fs.mkdirSync('dist/.well-known', { recursive: true })
            }
            fs.copyFileSync('public/.well-known/sitemap.xml', 'dist/.well-known/sitemap.xml')
          }
          
          console.log('All SEO files copied to dist/')
        } catch (error) {
          console.error('Failed to copy SEO files:', error)
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