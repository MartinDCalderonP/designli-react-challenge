self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('my-cache').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
        '/icon-192x192.png'
      ])
    })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'PRICE_ALERT') {
    const { symbol, price, alert } = event.data
    self.registration.showNotification('Price Alert', {
      body: `${symbol} price dropped below alert: $${price} < $${alert}`,
      icon: '/icon-192x192.png',
      tag: `price-alert-${symbol}`
    })
  }
})
