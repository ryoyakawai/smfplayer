/* sw.js */
importScripts('serviceworker-cache-polyfill.js');
var CACHE_NAME = 'smfplayer-cache';
var urlsToCache = [
    './index.html',
    './assets/js/jquery.js',
    './assets/js/bootstrap.min.js',
    './assets/css/bootstrap.css',
    './css/sticky-footer-navbar.css',
    './assets/css/bootstrap.css',
    './css/sticky-footer-navbar.css',
    './register_sw.js',
    './images/Logos-Github-icon.png',
    './images/Logos-Github-icon.png',
    './js/smfParser.js',
    './js/smfPlayer.js',
    './js/webmidilinkSender.js',
    './js/app.js',
    './js/msgSendWorker.js',
    './assets/fonts/glyphicons-halflings-regular.woff',
    './assets/fonts/glyphicons-halflings-regular.ttf',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(function(cache) {
              //console.log('Opened cache');
              return cache.addAll(urlsToCache);
          })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request)
          .then(function(response) {
              if (response) {
                  //console.log("[return cache] ", (response.url).split("/").pop());
                  return response;
              }
              var fetchRequest = event.request.clone();

              return fetch(fetchRequest)
                  .then(function(response) {
                      if (!response || response.status !== 200 || response.type !== 'basic') {
                          return response;
                      }
                      
                      var responseToCache = response.clone();

                      caches.open(CACHE_NAME)
                          .then(function(cache) {
                              cache.put(event.request, responseToCache);
                          });
                      
                      return response;
                  });
          })
  );
});

