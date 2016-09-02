'use strict';

var apiKey = '428a20d6f31803d62bc3d29c0eff0937';
var headerElement = document.querySelector('header');
var menuIconElement = document.querySelector('.header__icon');
var menuElement = document.querySelector('.menu');
var menuOverlayElement = document.querySelector('.menu__overlay');
var cardElement = document.querySelector('.card');

//To update network status
function updateNetworkStatus() {
  if (navigator.onLine) {
    headerElement.classList.remove('app__offline');
  }
  else {
    headerElement.classList.add('app__offline');
    showSnackBar('offline');
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

menuIconElement.addEventListener("click", showMenu, false);
menuOverlayElement.addEventListener("click", hideMenu, false);

(function () {

  //If `serviceWorker` is registered and ready
  navigator.serviceWorker.ready
    .then(function (registration) {
      isPushSupported(registration); //To check push is supported and enabled
    })

  //Check network status
  window.addEventListener('online', updateNetworkStatus, false);
  window.addEventListener('offline', updateNetworkStatus, false);

  //Get weather info via `Fetch API`
  function fetchWeatherInfo() {
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=Bangalore,India&units=metric&appid=' + apiKey;

    fetch(url, { method: 'GET' })
    .then(function(resp){ return resp.json() })
      .then(function(res) {
        console.log(res);
        var weatherIconName = (res.weather && res.weather[0] ? res.weather[0].icon :  "");
        var weatherImgUrl = 'http://openweathermap.org/img/w/' + weatherIconName + '.png';
        cardElement.querySelector('.card__title').textContent = res.name + ', ' + res.sys.country;
        cardElement.querySelector('.card__desc').textContent = res.weather && res.weather[0].main;
        cardElement.querySelector('.card__img').setAttribute('src', weatherImgUrl);
        cardElement.querySelector('.card__wind span').textContent = res.wind.speed + 'KM/H';
        cardElement.querySelector('.card__humidity span').textContent = res.main.humidity + "%";
        cardElement.querySelector('.card__temp span').textContent = res.main.temp + ' °C';
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  fetchWeatherInfo();
})();
