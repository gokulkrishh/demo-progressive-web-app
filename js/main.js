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

//Push notification button
var btn = document.getElementById("turn-on-notification");

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
  .then(function (subscription) {
    console.log("Push Notification Status: ", subscription);
    //If already access granted, change status and send subscription
    if (subscription) {
      dataToServer(subscription);
      changeStatus(true);
    }
    else {
      changeStatus(false);
    }
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
        changeStatus(true);

        //Send notification
        return dataToServer(subscription);
      })
      .catch(function (error) {
        console.log(error);
      })
  })
}

//To change status
function changeStatus(status) {
  btn.checked = status;
}

//Form data to server
var formData = new FormData();
var formData = {
  "registration_id": 123,
  "data" : {
    data: {
    }
  }
};

//Form data with info to send to server
function dataToServer() {

}

//To send push notification
function sendNotification() {

}
