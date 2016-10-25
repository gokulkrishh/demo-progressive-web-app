(function (exports) {
  'use strict';

  var toastContainer = document.querySelector('.toast__container');
 
  //To show notification
  function toast(msg, options) {
    if (!msg) return;

    options = options || 3000;

    var toastMsg = document.createElement('div');
    
    toastMsg.className = 'toast__msg';
    toastMsg.textContent = msg;

    toastContainer.appendChild(toastMsg);

    //Show toast for 3secs and hide it
    setTimeout(function () {
      toastMsg.classList.add('toast__msg--hide');
    }, options);

    //Remove the element after hiding
    toastMsg.addEventListener('transitionend', function (event) {
      event.target.parentNode.removeChild(event.target);
    });
  }

  exports.toast = toast; //Make this method available in global
})(typeof window === 'undefined' ? module.exports : window);
