
//Cache polyfil to support cacheAPI in all browsers
importScripts('/cache-polyfill.js');

var staticCache = 'initial-static-v1';

//My Cache names
var myCaches = [staticCache];

//Files to cache
var files = [
  '/',
  '/index.html',
  '/index.html?page=1', //Query string is treated as new page in serviceWorker
  '/css/styles.css',
  '/js/app.js',
  '/images/icons/G-Logo-128.png',
  '/js/jquery-2.1.4.js'
];

//Adding install event listener
self.addEventListener("install", function (event) {
  console.log("Event: Install");

  event.waitUntil(
    caches.open(staticCache)
    .then(function (cache) {
      //[] of files to cache & any of the file not present compelete `addAll` will fail
      return cache.addAll(files.map(function (fileUrl) {
        return new Request(fileUrl);
      }))
      .then(function () {
        console.log("All the files are cached.");
      })
      .catch(function (error) {
        console.error("Failed to cache the files.", error);
      })
    })
  );
});

/*
  FETCH EVENT:
    Will be triggered for every request made by index page, After install.
*/

//Fetch event to fetch stored caches
self.addEventListener("fetch", function (event) {
  console.log("Event: Fetch");

  console.log("Fetching -->", event.request.url);

  //To tell browser to evaluate the result of event
  event.respondWith(
    caches.match(event.request) //To match current request with cached request, return it
      .then(function(response) {
        //If response found return it else fetch again.
        return response || fetch(event.request);
      })
      .catch(function(error) {
        console.error("Error: ", error);
      })
  );
});

/*
  ACTIVATE EVENT:
    Will be triggered once after registering, also used to clean up caches
*/

//Activate event to delete old caches
self.addEventListener("activate", function (event) {
  console.log("Event: Activate");

  var cacheWhitelist = ['initial-cache-v1'];

  //Delete unwanted caches
  event.waitUntil(
    caches.keys()
      .then(function (allCaches) {
        allCaches.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        });
      })
  );
})
