
(function (exports) {
  'use strict';

  var snakBarElement = document.querySelector('.snack-bar');
  var snakBarMsg = document.querySelector('.snack-bar-msg');
  var snakBarAction = document.querySelector('.snack-bar-action');

  //To show notification
  function showSnackBar(msg) {
    if (!msg) return;

    if (snakBarElement.classList.contains('show')) {
      hideSnackBar();
    }

    snakBarElement.classList.add('show');
    snakBarMsg.textContent = msg;

    setTimeout(function () {
      hideSnackBar();
    }, 3000);
  }

  function hideSnackBar() {
    snakBarElement.classList.remove('show');
  }

  //To hide notification
  snakBarAction.addEventListener('click', function () {
    hideSnackBar();
  });

  exports.showSnackBar = showSnackBar; //Make this method available in global

})(typeof window === 'undefined' ? module.exports : window);
