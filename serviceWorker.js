
//Cache polyfil to support cacheAPI in all browsers
importScripts("/cache-polyfill.js");

var staticCache = "initial-static-v1";

//Files to cache
var files = [
  "./",
  "/index.html",
  "/index.html?page=1", //Query string is treated as new page in serviceWorker
  "/css/styles.css",
  "/js/app.js",
  "/js/main.js",
  "/js/jquery-2.1.4.js",
  "/images/icons/G-Logo-128.png"
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
  var request = event.request;
  var requestURL = new URL(request.url);

  console.log("Event: Fetch");

  console.log("Fetching -->", event.request.url);

  //Host name is hackernews, then cache the response
  if (requestURL.hostname === "hacker-news.firebaseio.com") {
    event.respondWith(caches.match(request) //To match current request with cached request, return it
      .then(function(response) {
        //If response found return it else fetch again.
        if (response) {
          return response;
        }
        else {
          return fetch(request)
          .then(function (response) {
            caches.open(staticCache).then(function(cache) {
              cache.put(request, response.clone());
            });

            return response;
          });
        }
      })
      .catch(function(error) {
        console.error("Error: ", error);
      })
    );
  }
  else {
    //To tell browser to evaluate the result of event
    event.respondWith(
      caches.match(request) //To match current request with cached request, return it
        .then(function(response) {
          //If response found return it else fetch again.
          return response || fetch(event.request);;
        })
        .catch(function(error) {
          console.error("Error: ", error);
        })
    );
  }
});

/*
  ACTIVATE EVENT:
    Will be triggered once after registering, also used to clean up caches
*/

//Activate event to delete old caches
self.addEventListener("activate", function (event) {
  console.log("Event: Activate");

  var cacheWhitelist = ["initial-cache-v1"];

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
});

/*
  PUSH EVENT:
    will be triggered when a push notification is received
*/

//To send notification to client
self.addEventListener("push", function(event) {
  console.log("Event: Push", event);

  var title = "Push notification demo";
  var body = "You have received a notification";
  var tag = "demo";
  var icon = "/images/icons/G-Logo-152.png";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
      icon: icon
    })
  );
});

/*
  NOTIFICATION EVENT:
    Will be triggered when user click the notification
*/

//On click event for notification to close
self.addEventListener("notificationclick", function(event) {
  console.log("Notification is clicked ", event);

  event.notification.close();

  //To open the app after click notification
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == "/" && "focus" in client) {
          return client.focus();
        }
      }
    })
  );
});
