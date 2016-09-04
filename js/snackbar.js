
(function (exports) {
  'use strict';

  var snakBarElement = document.querySelector('.snackbar');
  var snakBarMsg = document.querySelector('.snackbar__msg');
  var snakBarAction = document.querySelector('.snackbar__action');

  //To show notification
  function showSnackBar(msg) {
    if (!msg) return;

    if (snakBarElement.classList.contains('snackbar--show')) {
      hideSnackBar();
    }

    snakBarElement.classList.add('snackbar--show');
    snakBarMsg.textContent = msg;

    setTimeout(function () {
      hideSnackBar();
    }, 13000);
  }

  function hideSnackBar() {
    snakBarElement.classList.remove('snackbar--show');
  }

  //To hide notification
  snakBarAction.addEventListener('click', function () {
    hideSnackBar();
  });

  exports.showSnackBar = showSnackBar; //Make this method available in global

})(typeof window === 'undefined' ? module.exports : window);
