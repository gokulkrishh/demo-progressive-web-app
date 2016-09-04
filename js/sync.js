(function (window) {
  'use strict';

  var bgSyncTextElement = document.querySelector('.bg-sync__text');

  //To register 'BG Sync' and check 'push notification' support
  window.registerBGSync = function() {
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
      .then(function (registration) {
        //Registering `background sync` event
        return registration.sync.register('github') //`github` is sync tag name
          .then(function (rs) {
            console.info('Background sync registered!')
            bgSyncTextElement.removeAttribute('hidden'); //Show registered text to user
          }, function () {
            console.error('Background sync registered failed.');
          });

      });
  }
})(window);
