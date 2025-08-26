import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// Custom plugin to ensure public files are copied
function copyPublicFiles() {
  return {
    name: 'copy-public-files',
    closeBundle() {
      try {
        // Copy _redirects file
        copyFileSync('public/_redirects', 'dist/_redirects')
        console.log('Copied _redirects to dist/')
        
        // Copy manifest.json file
        copyFileSync('public/manifest.json', 'dist/manifest.json')
        console.log('Copied manifest.json to dist/')
        
        // Copy service worker
        copyFileSync('public/sw.js', 'dist/sw.js')
        console.log('Copied sw.js to dist/')
      } catch (error) {
        console.error('Error copying public files:', error)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyPublicFiles()],
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
  }
})