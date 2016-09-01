'use strict';

//Cache polyfil to support cacheAPI in all browsers
importScripts('/cache-polyfill.js');

var cacheName = 'initial-cache-v1';

//Files to save in cache
var files = [
  './',
  './index.html',
  './index.html?utm=homescreen', //SW treats query string as new page
  './css/styles.css',
  'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,700', //caching 3rd party content
  './images/icons/android-chrome-192x192.png',
  './js/all.js',
  './manifest.json'
];

//Adding `install` event listener
self.addEventListener('install', function (event) {
  console.info('Event: Install');

  event.waitUntil(
    caches.open(cacheName)
    .then(function (cache) {
      //[] of files to cache & if any of the file not present `addAll` will fail
      return cache.addAll(files)
      .then(function () {
        console.info('All files are cached');
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
  console.info('Event: Fetch');

  var request = event.request;

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
  console.info('Event: Activate');

  //Active Service Worker to set itself as the active on current client and all other active clients.
  return self.clients.claim();
});

/*
  PUSH EVENT: triggered everytime, when a push notification is received.
*/

//Adding `push` event listener
self.addEventListener('push', function(event) {
  console.info('Event: Push');

  var title = 'Push notification demo';
  var body = {
    'body': 'click to return to application',
    'tag': 'demo',
    'icon': '/images/icons/apple-touch-icon.png',
    //Custom actions buttons
    'actions': [
      { "action": "yes", "title": "I ♥ this app!"},
      { "action": "no", "title": "I don\'t like this app"}
    ]
  };

  event.waitUntil(self.registration.showNotification(title, body));
});

/*
  NOTIFICATION EVENT: triggered when user click the notification.
*/

//Adding `notification` click event listener
self.addEventListener('notificationclick', function(event) {
  //Listen to custom actions buttons
  if (event.action === 'yes') {
    console.log('I ♥ this app!');
  }
  else if (event.action === 'no') {
    console.warn('I don\'t like this app');
  }

  //To open the app after clicking notification
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(clients) {
      for (var i = 0; i < clients.length; i++) {
        var client = clients[i];
        //If site is opened, focus to the site
        if ('focus' in client && !client.focused) {
          event.notification.close();
          return client.focus();
        }
        //If site is not opened, open in new tab
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      }

      event.notification.close(); //Close the notification
    })
    .catch(function (err) {
      console.error(err);
    })
  );
});
