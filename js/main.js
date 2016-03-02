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
var endpoint;

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

      var endpointTemp = subscription.endpoint.split("/");
      endpoint = endpointTemp[endpointTemp.length - 1];
      localStorage.setItem("endpoint", JSON.stringify(endpoint));
      logCurlCommand(endpoint);
      changeStatus(true);
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
        endpoint = null;
        localStorage.removeItem("endpoint");
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
    unsubscribeNotification();
  }
  else {
    subscribeNotification();
  }
});

//To generate curl command to send push notification
function logCurlCommand(endPoint) {
  var curlCommand = 'curl --header "Authorization: key=' + apiKey + '" --header Content-Type:"application/json" ' + gcmURL + ' -d "{\\"registration_ids\\":[\\"' + endPoint + '\\"]}"';
  console.log("%ccurl command --> ", "background: #000; color: #fff; font-size: 16px;");
  console.log(curlCommand);
}

//Form data with info to send to server
function dataToServer(subscription) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

   $.ajax({
     url: "/send_notification.php?sid=" + endpoint + "&call=true"
   })
  .done(function(data) {
    console.log(data);
  });


  // //Fetch api to send push notification
  // fetch("" + "/send_notification.php?sid=" + endpoint, {
  //   headers: headers
  // })
  // .then(function(response) {
  //   return response.json();
  // })
  // .then(function (response) {
  //   console.log("push notification response -->", response);
  // })
  // .catch(function(error) {
  //   console.log(error);
  // });

}

//To send push notification
var pushBtn = document.getElementById("send-push");
pushBtn.addEventListener("click", function () {
  if (!endpoint) {
    endpoint = JSON.parse(localStorage.getItem("endpoint"));
    dataToServer(endpoint);
  }
  else {
    dataToServer(endpoint);
  }
});
