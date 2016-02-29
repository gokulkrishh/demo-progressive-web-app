//If serviceWorker supports, then register it.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./serviceWorker.js") //Point to serviceWorker file
    .then(function (serviceWorkerRegistration) {
      console.log("serviceWorker is registered");
      document.getElementById("sw-register-state").textContent = "✓";

      //To check support for push notifications
      isPushNotification(serviceWorkerRegistration);
    })
    .catch(function (error) {
      console.log("Failed to register serviceWorker");
      document.getElementById("sw-register-state").textContent = "✕"; //Failed to register
    });
}

//Tokens
var apiKey = "AIzaSyCjrU5SqotSg2ybDLK_7rMMt9Rv0dMusvY";
var payloadUrl = "https://android.googleapis.com/gcm/send";

//To check push notification support
function isPushNotification(serviceWorkerRegistration) {
  if (!serviceWorkerRegistration.pushManager) {
    alert("Update chrome browser to support push notifications");
    return;
  }

  serviceWorkerRegistration.pushManager.getSubscription()
  .then(function (status) {
    console.log("Push Notification Status: ", status);
  })
  .catch(function (error) {
    console.log(error);
  });
}

//To request push notification
function requestPushNotification() {
  navigator.serviceWorker.ready
  .then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe()
      .then(function (subscription) {
        console.log("Subscription: ", subscription);
      })
      .catch(function (error) {
        console.log(error);
      })
  })
}
