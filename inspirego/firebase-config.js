// COREBIQ Firebase Configuration
// Firebase project: corebic--inspirego

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// You MUST import Firestore so the dashboard can load data
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDShAm9FNnIj7sodlfzQF727pc9WhU-fc",
    authDomain: "corebic--inspirego.firebaseapp.com",
    projectId: "corebic--inspirego",
    storageBucket: "corebic--inspirego.firebasestorage.app",
    messagingSenderId: "1091888608027",
    appId: "1:1091888608027:web:6d4b56472871e3c48299be",
    measurementId: "G-FTT83137BO"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore Database (This was missing!)
const db = getFirestore(app);

// Export all so index.html and login.html can use them
export { app, auth, db, firebaseConfig };
```eof

### 2. The Service Worker (Saves as `sw.js`)
This controls the offline caching and triggers the PWA install popup. Save this in the same folder as your `index.html`.

```javascript:sw.js
const CACHE_NAME = "corebiq-v4";

// Only caching files that actually exist in your directory.
// We include your updated specific logo asset paths here.
const APP_SHELL = [
  "./",
  "./index.html",
  "./login.html",
  "./manifest.json",
  "./assets/name.png",
  "./assets/logo-app.png",
  "./assets/logo-favicon.png",
  "./assets/name-splash.png",
  "./assets/logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.error("SW Install Error: ", err))
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

// Network-first strategy: Tries to fetch from the network to get the latest data.
// If the network fails (offline), it falls back to the cached version.
self.addEventListener("fetch", event => {
  // We only want to cache GET requests (ignore POST/PUT for database writes)
  if (event.request.method !== "GET") return;
  
  // Skip cross-origin requests (like Firebase API calls) to prevent caching errors
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache valid, successful responses
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => {
        // Network failed, look in the cache
        return caches.match(event.request);
      })
  );
});
```eof

### 3. The PWA Manifest (Saves as `manifest.json`)
This tells Android/iOS how to display your app on the home screen. Save this in the same folder as `index.html`.

```json:manifest.json
{
  "name": "COREBIQ Work Flow",
  "short_name": "COREBIQ",
  "description": "Intelligent Business Workspace",
  "start_url": "./index.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F3F5F8",
  "theme_color": "#0F4C81",
  "icons": [
    {
      "src": "./assets/logo-app.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "./assets/logo-app.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```eof

### How to test:
1. Ensure your `firebase-config.js` is properly updated with the `db` export.
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R). 
3. The splash screen will disappear properly and it will either load the dashboard or immediately redirect you to `login.html`.