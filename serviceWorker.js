
//Cache polyfil to support cacheAPI in all browsers
importScripts('/cache-polyfill.js');

var cacheV1  = 'simpleApp'; //Cache name

//Files to cache
var files = [
  '/',
  '/index.html',
  '/index.html?page=1', //Query string is treated as new page in serviceWorker
  '/css/styles.css',
  '/js/app.js',
  '/js/jquery-2.1.4.js'
];

//Adding install event listener
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheV1) //To return cached requests
    .then(function (cache) {
      console.log('Cached');
      //[] of files to cache
      return cache.addAll(files); //If any of the file not present compelete `addAll` will fail
    })
  );
});

/*
  FETCH EVENT: will be triggered for every request made by index page
*/

//Adding fetch event listener
self.addEventListener('fetch', function (event) {
  console.log(event.request.url); //Network request made by the application

  //To tell browser to evaluate the result of event
  event.respondWith(
    caches.match(event.request) //To match current request with cached request, return it
      .then(function (response) {
        // Return the response if file is found
        // else make fetch request again;
        return response || fetch(event.request);
      })
  );
});
