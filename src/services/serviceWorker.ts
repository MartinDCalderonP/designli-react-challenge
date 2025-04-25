export const loadServiceWorker = () => {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope)

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              window.location.reload()
            }
          })
        }
      })
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error)
    })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker now controls the page')
  })
}
