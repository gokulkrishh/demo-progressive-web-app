(function (window) {
  'use strict';

  //Push notification button
  var notificationBtnElement = document.getElementById('turn-on-notification');
  var pushBtnElement = document.querySelector('.send-push');

  //API key & GCM Token
  var apiKey = 'AIzaSyCjrU5SqotSg2ybDLK_7rMMt9Rv0dMusvY'; //replace with your own key
  var gcmURL = 'https://android.googleapis.com/gcm/send';

  //To check `push notification` is supported
  function isPushSupported() {
    //To check `push notification` permission is denied by user
    if (Notification.permission === 'denied') {
      console.warn('User has blocked push notification.');
      return;
    }

    //Check `push notification` is supported or not
    if (!('PushManager' in window)) {
      console.error('Push notification isn\'t supported in your browser.');
      return;
    }

    //Get `push notification` subscription
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
      .then(function (registration) {
        registration.pushManager.getSubscription()
        .then(function (subscription) {
          //If already access granted, enable push button status
          if (subscription) {
            changePushStatus(true);
          }
          else {
            changePushStatus(false);
          }
        })
        .catch(function (error) {
          console.error('Error occurred while enabling push ', error);
        });
      });
  }

  //To subscribe `push notification`
  function subscribePush() {
    navigator.serviceWorker.ready
    .then(function(registration) {
      if (!registration.pushManager) {
        alert('Your browser doesn\'t support push notification.');
        return;
      }

      //To subscribe `push notification` from push manager
      registration.pushManager.subscribe({
        userVisibleOnly: true //Always show notification when received
      })
      .then(function (subscription) {
        console.info('Push notification subscribed.');
        changePushStatus(true);
      })
      .catch(function (error) {
        changePushStatus(false);
        console.error('Push notification subscription error: ', error);
      })
    })
  }

  //To unsubscribe `push notification`
  function unsubscribePush() {
    navigator.serviceWorker.ready
    .then(function(registration) {
      //Get `push subscription`
      registration.pushManager.getSubscription()
      .then(function (subscription) {
        //If no `push subscription`, then return
        if(!subscription) {
          console.error('Unable to unregister push notification.');
          return;
        }

        //Unsubscribe `push notification`
        subscription.unsubscribe()
          .then(function () {
            console.info('Push notification unsubscribed.');
            changePushStatus(false);
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error('Failed to unsubscribe push notification.');
      });
    })
  }

  //To change status
  function changePushStatus(status) {
    notificationBtnElement.dataset.checked = status;
    notificationBtnElement.checked = status;
    if (status) {
      pushBtnElement.removeAttribute("disabled");
    }
    else {
      pushBtnElement.setAttribute("disabled", true);
    }
  }

  //Click event for subscribe notificationBtnElement
  notificationBtnElement.addEventListener('click', function () {
    var isBtnChecked = (notificationBtnElement.dataset.checked === 'true');
    if (isBtnChecked) {
      unsubscribePush();
    }
    else {
      subscribePush();
    }
  });

  //To generate curl command to send push notification
  function curlCommand(subscription) {
    var temp = subscription.endpoint.split('/');
    var endpoint = temp[temp.length - 1];
    var curlCommand = 'curl --header "Authorization: key=' + apiKey + '" --header Content-Type:"application/json" ' + gcmURL + ' -d "{\\"registration_ids\\":[\\"' + endpoint + '\\"]}"';
    console.log("%c curl command to send push notification ", "background: #000; color: #fff; font-size: 13px;");
    console.log(curlCommand);
  }

  //Form data with info to send to server
  function sendPushNotification(subscription) {
    navigator.serviceWorker.ready
      .then(function(registration) {
        //Get `push subscription`
        registration.pushManager.getSubscription()
        .then(function (subscription) {
          curlCommand(subscription); //To log curl command

          //Send `push notification` - source for below url `server.js`
          fetch('https://progressive-web-application.herokuapp.com/send_notification', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
          })
          .then(function(response) {
            return response.json();
          })
        })
      })
  }

  //To send `push notification`
  pushBtnElement.addEventListener("click", function () {
    sendPushNotification();
  }, false);

  isPushSupported(); //Check for push notification support
})(window);
