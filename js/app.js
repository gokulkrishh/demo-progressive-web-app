(function () {
  'use strict';

  var apiKey = '428a20d6f31803d62bc3d29c0eff0937';
  var headerElement = document.querySelector('header');
  var menuIconElement = document.querySelector('.header__icon');
  var menuElement = document.querySelector('.menu');
  var menuOverlayElement = document.querySelector('.menu__overlay');
  var cardElement = document.querySelector('.card');
  var addCardBtnElement = document.querySelector('.add__btn');
  var addCardInputElement = document.querySelector('.add__input');

  //To update network status
  function updateNetworkStatus() {
    if (navigator.onLine) {
      headerElement.classList.remove('app__offline');
    }
    else {
      headerElement.classList.add('app__offline');
    }
  }

  //To show menu
  function showMenu() {
    menuElement.classList.add("menu--show");
    menuOverlayElement.classList.add("menu__overlay--show");
  }

  //To hide menu
  function hideMenu() {
    menuElement.classList.remove("menu--show");
    menuOverlayElement.classList.remove("menu__overlay--show");
  }

  //Add weather card from user
  function addWeatherCard() {
    var userInput = addCardInputElement.value;
    if (userInput === "") return;
    addCardInputElement.value = "";
    fetchWeatherInfo(userInput);
  }

  //Menu click event
  menuIconElement.addEventListener("click", showMenu, false);
  menuOverlayElement.addEventListener("click", hideMenu, false);

  //Add card click event
  addCardBtnElement.addEventListener("click", addWeatherCard, false);

  //Check network status
  window.addEventListener('online', updateNetworkStatus, false);
  window.addEventListener('offline', updateNetworkStatus, false);

  //To register 'BG Sync' and check 'push notification' support
  function registerBGSync() {
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
      .then(function (registration) {
        //Since `bg sync` is not supported by other
        if ('SyncManager' in window) {
          //To check push is supported and enabled
          isPushSupported(registration);

          //Request for `notification permission`, if user granted access then register `bg sync`.
          Notification.requestPermission(function(result) {
            if (result !== 'granted') {
              console.error('Denied notification permission');
              return result;
            }
          })
          .then(function () {
            //Registering `background sync` event
            return registration.sync.register('weatherCard'); //`weatherCard` is sync tag name
          })
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  //Get weather info via `Fetch API`
  function fetchWeatherInfo(username) {
    var name = username || 'gokulkrishh';

    var url = 'https://api.github.com/users/' + name;

    fetch(url, { method: 'GET' })
    .then(function(resp){ return resp.json() })
      .then(function(res) {
        cardElement.querySelector('.card__title').textContent = res.name;
        cardElement.querySelector('.card__desc').textContent = res.bio;
        cardElement.querySelector('.card__img').setAttribute('src', res.avatar_url);
        cardElement.querySelector('.card__following span').textContent = res.following;
        cardElement.querySelector('.card__followers span').textContent = res.followers;
        cardElement.querySelector('.card__temp span').textContent = res.company;
        localStorage.removeItem("failed-request"); //Once API is success, remove if failed-request is present
      })
      .catch(function (error) {
        //If user is offline and sent a request, store it in localStorage
        //Once user comes online, trigger bg sync fetch from application tab to make the failed request
        if (!navigator.onLine) {
          localStorage.setItem("failed-request", name);
        }
        console.error(error);
      });
  }

  //Listen postMessage from `background sync`
  navigator.serviceWorker.addEventListener('message', function (event) {
    console.info('From background sync: ', event.data);
    fetchWeatherInfo(localStorage.getItem("failed-request"));
  });


  fetchWeatherInfo(); //Fetch weather data
  registerBGSync(); //Register BG Sync
})();
