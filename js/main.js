//If serviceWorker supports, then register it.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./serviceWorker.js") //Point to serviceWorker file
    .then(function (registration) {
      console.log("Service Worker is registered", registration);
      document.getElementById("sw-register-state").textContent = "✓";

      //To check support for push notifications
      isPushNotification(registration);
    })
    .catch(function (error) {
      console.error("Failed to register service worker", error);
      document.getElementById("sw-register-state").textContent = "✕"; //Failed to register
    });
}

//Push notification button
var btn = document.getElementById("turn-on-notification");

//Tokens
var apiKey = "AIzaSyCjrU5SqotSg2ybDLK_7rMMt9Rv0dMusvY";
var gcmURL = "https://android.googleapis.com/gcm/send";

//To check push notification support
function isPushNotification(serviceWorkerRegistration) {
  serviceWorkerRegistration.pushManager.getSubscription()
  .then(function (subscription) {
    console.log("Push Notification Status: ", subscription);
    //If already access granted, change status and send subscription
    if (subscription) {
      changeStatus(true);
    }
    else {
      changeStatus(false);
    }
  })
  .catch(function (error) {
    console.error(error);
  });
}

//To subscript push notification
function subscribe() {
  navigator.serviceWorker.ready
  .then(function(registration) {
    if (!registration.pushManager) {
      alert("Your browser doesn't support push notifications");
      return;
    }

    registration.pushManager.subscribe({
      userVisibleOnly: true //To always show notification when received
    })
    .then(function (subscription) {
      console.log("Successfully subscribed: ", subscription);
      changeStatus(true);
    })
    .catch(function (error) {
      console.error(error);
    })
  })
}

//To unsubscribe push notification
function unsubscribe() {
  navigator.serviceWorker.ready
  .then(function(registration) {
    registration.pushManager.getSubscription()
    .then(function (subscription) {
      //If not push subscription, then return
      if(!subscription) {
        console.error("Unable to unregister from push notification");
        return;
      }

      //Unsubscribe
      subscription.unsubscribe()
        .then(function () {
          console.log("Successfully unsubscribed");
          changeStatus(false);
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error("Failed to unsubscribe push notification");
    });
  })
}

//To change status
function changeStatus(status) {
  btn.dataset.checked = status;
  btn.checked = status;
  if (status) {
    $(".btn-notification").removeClass("hide");
  }
  else {
    $(".btn-notification").addClass("hide");
  }
}

//Click event for subscribe btn
btn.addEventListener("click", function () {
  var isBtnChecked = (btn.dataset.checked === "true");
  if (isBtnChecked) {
    unsubscribe();
  }
  else {
    subscribe();
  }
});

//To generate curl command to send push notification
function curlCommand(subscription) {
  var temp = subscription.endpoint.split("/");
  var endpoint = temp[temp.length - 1];
  var curlCommand = 'curl --header "Authorization: key=' + apiKey + '" --header Content-Type:"application/json" ' + gcmURL + ' -d "{\\"registration_ids\\":[\\"' + endpoint + '\\"]}"';
  console.log("%ccurl command: ", "background: #000; color: #fff; font-size: 16px;");
  console.log(curlCommand);
}

//Form data with info to send to server
function sendPushNotification(subscription) {
  navigator.serviceWorker.ready
    .then(function(registration) {
      registration.pushManager.getSubscription()
      .then(function (subscription) {
        curlCommand(subscription); //To log curl command in console
        fetch("/send_notification", {
          method: "post",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(subscription)
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.error("data", data);
        })
      })
    })
}

//To send push notification
var pushBtn = document.getElementById("send-push");
pushBtn.addEventListener("click", function () {
  sendPushNotification();
});
