const CACHE_NAME = "corebiq-v3";
// ONLY include files that actually exist in your directory.
// Removed style.css, header.css, etc., since your CSS is inline in index.html.
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/logo.png",
  "./assets/app-name.png",
  "./assets/app-icon.png",
  "./assets/fav.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.error("SW Install Error: ", err)) // Added error logging
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
```eof
```json:manifest.json
{
  "name": "COREBIQ Work Flow",
  "short_name": "COREBIQ",
  "description": "Intelligent Business Workspace",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#F3F5F8",
  "theme_color": "#0F4C81",
  "icons": [
    {
      "src": "./assets/App-icon.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "./assets/App-icon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
