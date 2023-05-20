// sw hat unterschiedliche Zustände: installing, installed, activating, activated
// `self` ist das ServiceWorker-Objekt
// `navigator` ist das Browser-Objekt
// anstatt 'function ()' '() => ' verwenden. '=>' ist eine anonyme Funktion 
// (https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Pfeilfunktionen)

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open('static')
            .then((cache) => {
                console.log('[Service Worker] Precaching - cache erzeugt und geöffnet');
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/feed.css',
                    '/src/images/htw.jpg',
                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css'
                ]);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker ...', event);
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching something ...', event);
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) {
                return response;
            } else {
                return fetch(event.request).then((res) => {
                    return caches.open('dynamic')
                        .then((cache) => {
                            cache.put(event.request.url, res.clone());
                            return res;
                        })
                });
            }
        })
    );

    
    // respondWith() ist eine Methode des FetchEvent-Objekts, um die Antwort zu manipulieren und zu steuern
    // event.respondWith(fetch(event.request));
});

