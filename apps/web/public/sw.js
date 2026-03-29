/**
 * Service Worker — Kiosk PWA offline shell
 *
 * Caches the app shell so the kiosk can show UI even when offline.
 * API calls go through the network; if offline, they fail gracefully
 * and the offline.ts action queue handles them.
 */

const CACHE_NAME = 'catsp-v1'
const SHELL_URLS = [
  '/',
  '/index.html',
]

// Install: cache the shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch: network-first for API, cache-first for shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // API calls: network only (offline queue handles failures)
  if (url.pathname.startsWith('/rest/') || url.pathname.startsWith('/auth/') || url.hostname !== self.location.hostname) {
    return
  }

  // App shell: cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        // Update cache with fresh version
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      }).catch(() => cached) // If network fails, use cache

      return cached || fetched
    })
  )
})
