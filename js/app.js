'use strict';

var apiKey = '428a20d6f31803d62bc3d29c0eff0937';
// var spinnerElement = document.querySelector('.spinner');
var headerElement = document.querySelector('header');
var menuIconElement = document.querySelector('.header-icon');
var menuElement = document.querySelector('.menu');
var menuOverlayElement = document.querySelector('.menu-overlay');
var disableLogElement = document.querySelector('.disable-console-log');

//Listen to disable log checkbox
disableLogElement.addEventListener("change", function (event) {
  if (event.target.checked) {
    localStorage.setItem("disable-log", true);
    disableLog();
  }
  else {
    localStorage.removeItem("disable-log");
    console = window.console;
  }
}, false);

//To disable console log
function disableLog() {
  console.log = function() {};
}

//To show/hide loading indicator
function toggleSpinner() {
  if (spinnerElement.classList.contains('hide')) {
    spinnerElement.classList.remove('hide');
  }
  else {
    spinnerElement.classList.add('hide');
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

  if (localStorage.getItem("disable-log")) {
    console.log = function() {};
    disableLogElement.checked = true;
  }

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
