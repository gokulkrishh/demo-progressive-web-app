(function () {
  'use strict';

  var headerElement = document.querySelector('header');
  var metaTagTheme = document.querySelector('meta[name=theme-color]');

  //After DOM Loaded
  document.addEventListener('DOMContentLoaded', function(event) {
    //On initial load to check connectivity
    if (!navigator.onLine) {
      updateNetworkStatus();
    }

    window.addEventListener('online', updateNetworkStatus, false);
    window.addEventListener('offline', updateNetworkStatus, false);
  });

  //To update network status
  function updateNetworkStatus() {
    if (navigator.onLine) {
      metaTagTheme.setAttribute('content', '#0288d1');
      headerElement.classList.remove('app__offline');
    }
    else {
      toast('App is offline');
      metaTagTheme.setAttribute('content', '#6b6b6b');
      headerElement.classList.add('app__offline');
    }
  }
})();