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
var pushManager;
var gcmURL = "https://android.googleapis.com/gcm/send";


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

//To subscript push notification
function subscribeNotification() {
  navigator.serviceWorker.ready
  .then(function(serviceWorkerRegistration) {
    pushManager = serviceWorkerRegistration.pushManager;

    pushManager.subscribe({
      userVisibleOnly: true //To always show notification when received
    })
    .then(function (subscription) {
      console.log("Successfully subscribed: ", subscription);
      console.log("Endpoint: ", subscription.endpoint);
      logCurlCommand(subscription.endpoint.split(gcmURL)[1]);
      changeStatus(true);

      //Send notification
      return dataToServer(subscription);
    })
    .catch(function (error) {
      console.log(error);
    })
  })
}

//To unsubscribe push notification
function unsubscribeNotification() {
  navigator.serviceWorker.ready
  .then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription()
    .then(function (pushSubscription) {
      //If not push subscription, then return
      if(!pushSubscription) {
        console.error('Unable to unregister from push notification');
        return;
      }

      pushSubscription.unsubscribe()
      .then(function () {
        console.log("Successfully unsubscribed");
        endPoint = null;
        changeStatus(false);
      })
      .catch(function (error) {
        console.log(error);
      });
    })
    .catch(function (error) {
      console.log("Failed to unsubscribe push notification");
    });
  })
}

//To change status
function changeStatus(status) {
  btn.dataset.checked = status;
  btn.checked = status;
}

//Click event for subscribe btn
btn.addEventListener("click", function () {
  var isBtnChecked = (btn.dataset.checked === "true");
  if (isBtnChecked) {
    unsubscribeNotification();
  }
  else {
    subscribeNotification();
  }
});

//Form data to server
var formData = new FormData();
var formData = {
  "registration_id": apiKey,
  "data.data" : {

  }
};

function logCurlCommand(endPoint) {
  var curlCommand = 'curl --header "Authorization: key=' + apiKey + '" --header Content-Type:"application/json" ' + gcmURL + ' -d "{\\"registration_ids\\":[\\"' + endPoint + '\\"]}"';
  console.log("%ccurl command --> ", "background: #000; color: #fff; font-size: 16px;");
  console.log(curlCommand);
}

//Form data with info to send to server
function dataToServer(subscription) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  //Fetch api to send push notification
  fetch("https://gokulkrishh.github.io/demo/sw/", {
    method: 'post',
    headers: headers,
    body: JSON.stringify(subscription)
  }).then(function(response) {
    return response.json();
  })
  .then(function (response) {
    console.log("response -->", response);
  })
  .catch(function(error) {
    console.log(error);
  });

}

//To send push notification
function sendNotification() {

}
