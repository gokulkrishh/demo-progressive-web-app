
//Cache polyfil to support cacheAPI in all browsers
importScripts('/cache-polyfill.js');

var staticCache = 'initial-cache-v1';
var apiCache = 'initial-api-cache-v1';

//My Cache names
var myCaches = [
  staticCache,
  apiCache
];

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
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCache) //To return cached requests
    .then(function (cache) {
      //[] of files to cache & any of the file not present compelete `addAll` will fail
      cache.addAll(files.map(function (url) {
        return new Request(url, {mode: 'no-cors'}); //Adding CORS support for server if not there
      }))
      .then(function () {
        console.log('All the files are cached.');
      })
      .catch(function () {
        console.error('Failed to cached the files.');
      });
    })
  );
});

/*
  ACTIVATE EVENT:
    Will be triggered once after registering, also used to clean up caches
*/

self.addEventListener('activate', function(event) {
  console.log('myCaches --->', myCaches);

  var cacheWhitelist = ['initial-cache-v1', 'initial-api-cache-v1'];

  //Delete unwanted caches
  event.waitUntil(
    caches.keys()
      .then(function (caches) {
        return Promise.all(
          caches.map(function (cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
    })
  );
});

/*
  FETCH EVENT:
    Will be triggered for every request made by index page, After install.
*/

//Adding fetch event listener
self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);
  console.log('Fetch ---> ', event.request.url); //Network request made by the application

  //If request url is for API, send the cached response
  if (requestURL.hostname === "hacker-news.firebaseio.com") {
    var request = event.request;

    caches.match(request)
      .then(function (response) {
        console.log('Response found in cache --->', response);
        if (response && response.status === 200) {
          return response.json()
            .then(function (res) {
              return res;
            });
        }
        else {
          apiToCache(request);
        }
      })
      .catch(function (error) {
        console.error(error);
        apiToCache(request);
      });
  }
  else {
    //To tell browser to evaluate the result of event
    event.respondWith(
      caches.match(event.request) //To match current request with cached request, return it
        .then(function (response) {
          if (response) {
            console.log('Response found in cache --->', response)
            return response;
          }

          console.log('No response found in cache. So fetching...');

          //Cloning the request, because request is a steam and can only be consumed once.
          //Read more: http://www.html5rocks.com/en/tutorials/service-worker/introduction
          var requestForFetch = event.request.clone();

          //Adding uncached request to cached list
          return fetch(requestForFetch).then(function () {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseForCache = response.clone(); //Same reason as request.clone()

            caches.open(cacheV1).then(function(cache) {
              var cachedRequest = event.request.clone();
              console.log('Adding to cache --->', cachedRequest);
              cache.put(cachedRequest, responseForCache); //Adding to cache
            });

            return response;
          });
      })
      .catch(function(error) {
        console.log("Error --->", error);
      })
    );
  }
});

function apiToCache(request) {
  return fetch(request.clone(), {
      "mode": "cors"
    })
    .then(function(response) {
      return caches.open(apiCache)
        .then(function(cache) {
           var cachedRequest = request.clone();
           var cachedResponse = response.clone();

            //API response not in cache, then add it
           cache.put(cachedRequest, cachedResponse)
             .then(function() {
               console.log('Adding hackernews API response to cache');
             },
             function (error) {
               console.error("Failed to add hackernews API to cache ", error);
             });
          return response;
        });
    });
}
