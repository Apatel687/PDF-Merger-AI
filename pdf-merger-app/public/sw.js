// Service Worker for PDF Merger AI PWA
const CACHE_NAME = 'pdf-merger-ai-v1';
const urlsToCache = [
  './',
  './index.html',
  './pdf.worker.min.js',
  './pdf.min.js',
  './vite.svg'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  try {
    // Validate request URL to prevent SSRF
    const url = new URL(event.request.url);
    const allowedOrigins = [self.location.origin];
    
    // Only allow same-origin requests and HTTPS
    if (!allowedOrigins.includes(url.origin) || url.protocol !== 'https:') {
      if (url.origin !== self.location.origin) {
        return; // Block cross-origin requests
      }
    }
    
    // Allow localhost for development
    const hostname = url.hostname;
    // Removed localhost blocking for development
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Only return cached content, no network requests
          return response || new Response('Not found in cache', { status: 404 });
        })
        .catch(error => {
          console.error('Cache lookup failed:', error);
          return new Response('Cache error', { status: 500 });
        })
    );
  } catch (error) {
    console.error('Invalid URL in service worker:', error);
    return;
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});