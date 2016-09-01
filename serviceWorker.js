'use strict';

//Cache polyfil to support cacheAPI in all browsers
importScripts('/cache-polyfill.js');

var cacheName = 'initial-cache-v1';

//Files to save in cache
var files = [
  './',
  '/index.html',
  '/index.html?utm=homescreen', //SW treats query string as new page
  '/css/styles.css',
  'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,700', //caching 3rd party content
  '/images/icons/android-chrome-192x192.png',
  '/js/app.js',
  '/js/main.js',
  '/js/snackbar.js',
  '/manifest.json'
];

//Adding `install` event listener
self.addEventListener('install', function (event) {
  console.log('Event: Install');

  event.waitUntil(
    caches.open(cacheName)
    .then(function (cache) {
      //[] of files to cache & if any of the file not present `addAll` will fail
      return cache.addAll(files)
      .then(function () {
        console.log('All files are cached');
        return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
      })
      .catch(function (error) {
        console.error('Failed to cache', error);
      })
    })
  );
});

/*
  FETCH EVENT: triggered for every request made by index page, after install.
*/

//Adding `fetch` event listener
self.addEventListener('fetch', function (event) {
  var request = event.request;

  console.log('Event: Fetch');

  //Tell the browser to wait for network request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then(function(response) {
      if (response) {
        return response;
      }

      //if request is not cached, add it to cache
      return fetch(request).then(function(response) {
        var responseToCache = response.clone();
        caches.open(cacheName).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              console.warn(request.url + ': ' + err.message);
            });
          });

        return response;
      });
    })
  );
});

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

//Adding `activate` event listener
self.addEventListener('activate', function (event) {
  console.log('Event: Activate');

  //Active Service Worker to set itself as the active on current client and all other active clients.
  return self.clients.claim();
});

/*
  PUSH EVENT: triggered everytime, when a push notification is received.
*/

//Adding `push` event listener
self.addEventListener('push', function(event) {
  console.log('Event: Push', event);

  var title = 'Push notification demo';
  var body = {
    'body': 'You have received a notification',
    'tag': 'demo',
    'icon': '/images/icons/apple-touch-icon.png'
  };

  event.waitUntil(self.registration.showNotification(title, body));
});

/*
  NOTIFICATION EVENT: triggered when user click the notification.
*/

//Adding `notification` click event listener
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked ', event);

  //To open the app after clicking notification
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(clientList) {
      console.log("clientList -->", clientList);
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        console.log("client", client);
        if (client.url == '/' && 'focus' in client) {
          return client.focus();
        }
      }
    })

    event.notification.close();
  );
});
