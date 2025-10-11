// Vendorr PWA Service Worker
const CACHE_NAME = 'vendorr-v1.0.0'
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon-192x192.svg',
  '/assets/icon-512x512.svg',
  '/offline.html'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Ensure the new service worker takes control immediately
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for offline access
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Serve from cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline page for failed API requests
            return caches.match('/offline.html')
          })
        })
    )
    return
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            // Serve offline page for failed navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html')
            }
          })
      })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)

  const defaultOptions = {
    icon: '/assets/icon-192x192.svg',
    badge: '/assets/icon-72x72.png',
    vibrate: [100, 50, 100],
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/assets/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/icon-72x72.png'
      }
    ]
  }

  let notificationData = {
    title: 'Vendorr Update',
    body: 'You have a new notification',
    ...defaultOptions
  }

  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        data: data.data || {},
        ...defaultOptions,
        ...data.options
      }
    } catch (error) {
      console.error('Error parsing push data:', error)
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)

  event.notification.close()

  const { action, data } = event
  let urlToOpen = '/'

  if (action === 'view' && data?.orderId) {
    urlToOpen = `/orders/${data.orderId}`
  } else if (action === 'dismiss') {
    return
  } else if (data?.url) {
    urlToOpen = data.url
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if the app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus()
            client.navigate(urlToOpen)
            return
          }
        }

        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Background sync event (for offline actions)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)

  if (event.tag === 'order-sync') {
    event.waitUntil(syncPendingOrders())
  }

  if (event.tag === 'notification-sync') {
    event.waitUntil(syncNotifications())
  }
})

// Helper function to sync pending orders
async function syncPendingOrders() {
  try {
    const cache = await caches.open(CACHE_NAME)
    const pendingOrders = await cache.match('/pending-orders')

    if (pendingOrders) {
      const orders = await pendingOrders.json()

      for (const order of orders) {
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(order)
          })

          if (response.ok) {
            console.log('Order synced successfully:', order.id)
          }
        } catch (error) {
          console.error('Failed to sync order:', order.id, error)
        }
      }

      // Clear pending orders after sync attempt
      await cache.delete('/pending-orders')
    }
  } catch (error) {
    console.error('Error during order sync:', error)
  }
}

// Helper function to sync notifications
async function syncNotifications() {
  try {
    // Fetch latest notifications from server
    const response = await fetch('/api/notifications')
    if (response.ok) {
      const notifications = await response.json()

      // Show any new notifications
      for (const notification of notifications) {
        if (notification.unread) {
          await self.registration.showNotification(notification.title, {
            body: notification.message,
            icon: '/assets/icon-192x192.svg',
            data: notification.data
          })
        }
      }
    }
  } catch (error) {
    console.error('Error syncing notifications:', error)
  }
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data?.type === 'CACHE_ORDER') {
    cacheOrder(event.data.order)
  }
})

// Helper function to cache orders for offline access
async function cacheOrder(order) {
  try {
    const cache = await caches.open(CACHE_NAME)
    const response = new Response(JSON.stringify(order), {
      headers: { 'Content-Type': 'application/json' }
    })
    await cache.put(`/offline-order-${order.id}`, response)
    console.log('Order cached for offline access:', order.id)
  } catch (error) {
    console.error('Error caching order:', error)
  }
}
