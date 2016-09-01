'use strict';

var apiKey = '428a20d6f31803d62bc3d29c0eff0937';
var spinnerElement = document.querySelector('.spinner');
var spinnerClassList = spinnerElement.classList;
var headerElement = document.querySelector('header');
var menuIconElement = document.querySelector('.header-icon');
var menuElement = document.querySelector('.menu');
var menuOverlayElement = document.querySelector('.menu-overlay');

//To show/hide loading indicator
function toggleSpinner() {
  if (spinnerClassList.contains('hide')) {
    spinnerClassList.remove('hide');
  }
  else {
    spinnerClassList.add('hide');
  }
}

//To update network status
function updateNetworkStatus() {
  if (navigator.onLine) {
    headerElement.classList.remove('offline');
  }
  else {
    headerElement.classList.add('offline');
    showSnackBar('offline');
  }
}

//To show menu
function showMenu() {
  menuElement.classList.add("show");
  menuOverlayElement.classList.add("show");
}

//To hide menu
function hideMenu() {
  menuElement.classList.remove("show");
  menuOverlayElement.classList.remove("show");
}

menuIconElement.addEventListener("click", showMenu, false);
menuOverlayElement.addEventListener("click", hideMenu, false);

(function () {
  //Check network status
  window.addEventListener('online', updateNetworkStatus, false);
  window.addEventListener('offline', updateNetworkStatus, false);

  //Get weather info via `Fetch API`
  function fetchWeatherInfo() {
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=Bangalore,India&appid=' + apiKey;

    fetch(url, { method: 'GET' })
    .then(resp => resp.json())
      .then(res => {
        console.log('response -->', res);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  fetchWeatherInfo();
})();
