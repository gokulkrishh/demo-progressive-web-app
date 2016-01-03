$(function () {
  var url = 'https://api.github.com/users/gokulkrishh/repos?sort=updated';

  $.get(url)
  .success(function (response) {
    console.log(response)
    response.map(function (repo, index) {
      return(
        $('#main').append(
          "<div class=\"container\">" +
          "<p> <span>Name:</span> <a href='"+ repo.html_url + "'>" + repo.name + "</a></p>" +
          "<p> <span>Star:</span> " + repo.stargazers_count + "</p>" +
          "<p> <span>Fork:</span> " + repo.forks_count + "</p>" +
          "</div>"
        )
      );
    });
  })
  .error(function (error) {
    console.log(error);
  });


  $('#menu-overlay, .menu-icon, #menu a').on('click', function (event) {
    event.stopPropagation();

    var $menuEle = $('#menu');

    if ($menuEle.hasClass('visible')) {
      $menuEle.removeClass('visible');
      $('#menu-overlay').removeClass('visible');
    }
    else {
      $menuEle.addClass('visible');
      $('#menu-overlay').addClass('visible');
    }

  });
});
