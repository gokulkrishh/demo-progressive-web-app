(function (window) {
  'use strict';

  var bgSyncTextElement = document.querySelector('.bg-sync__text');
  var bgSyncElement = document.querySelector('.custom__button-bg');
  var bgSyncBtnElement = document.querySelector('.turn-on-sync');

  bgSyncBtnElement.addEventListener('click', function () {
    window.registerBGSync();
  });

  //To register `BG Sync` and check 'push notification' support
  //Exposing `registerSync()` globally for only development purpose
  window.registerBGSync = function() {
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
      .then(function (registration) {
        //Registering `background sync` event
        return registration.sync.register('github') //`github` is sync tag name
          .then(function (rs) {
            console.info('Background sync registered!');
            bgSyncElement.classList.add('hide');
            bgSyncTextElement.removeAttribute('hidden'); //Show registered text to user
          }, function () {
            console.error('Background sync registered failed.');
          });

      });
  }
})(window);
