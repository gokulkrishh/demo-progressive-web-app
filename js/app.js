(function () {
  'use strict';

  var cardElement = document.querySelector('.card');
  var addCardBtnElement = document.querySelector('.add__btn');
  var addCardInputElement = document.querySelector('.add__input');
  var spinnerElement = document.querySelector('.card__spinner');
  var bgSyncTextElement = document.querySelector('.bg-sync__text');
  var bgSyncElement = document.querySelector('.custom__button-bg');

  //Add github user data to the card
  function addGitUserCard() {
    var userInput = addCardInputElement.value;
    if (userInput === '') return;
    addCardInputElement.value = '';
    localStorage.setItem('request', userInput);
    fetchGitUserInfo(userInput);
  }

  //Add card click event
  addCardBtnElement.addEventListener('click', addGitUserCard, false);

  //To get github user data via `Fetch API`
  function fetchGitUserInfo(username, requestFromBGSync) {
    var name = username || 'gokulkrishh';
    var url = 'https://api.github.com/users/' + name;

    spinnerElement.classList.add('show'); //show spinner

    fetch(url, { method: 'GET' })
    .then(function(fetchResponse){ return fetchResponse.json() })
      .then(function(response) {
        if (!requestFromBGSync) {
          localStorage.removeItem('request'); //Once API is success, remove request data from localStorage
        }
        cardElement.querySelector('.card__title').textContent = response.name;
        cardElement.querySelector('.card__desc').textContent = response.bio;
        cardElement.querySelector('.card__img').setAttribute('src', response.avatar_url);
        cardElement.querySelector('.card__following span').textContent = response.following;
        cardElement.querySelector('.card__followers span').textContent = response.followers;
        cardElement.querySelector('.card__temp span').textContent = response.company;
        spinnerElement.classList.remove('show'); //hide spinner
      })
      .catch(function (error) {
        //If user is offline and sent a request, store it in localStorage
        //Once user comes online, trigger bg sync fetch from application tab to make the failed request
        localStorage.setItem('request', name);
        spinnerElement.classList.remove('show'); //hide spinner
        console.error(error);
      });
  }

  fetchGitUserInfo(localStorage.getItem('request')); //Fetch github users data

  //Listen postMessage when `background sync` is triggered
  navigator.serviceWorker.addEventListener('message', function (event) {
    console.info('From background sync: ', event.data);
    fetchGitUserInfo(localStorage.getItem('request'), true);
    bgSyncElement.classList.remove('hide'); //Once sync event fires, show register toggle button
    bgSyncTextElement.setAttribute('hidden', true); //Once sync event fires, remove registered label
  });
})();
