$(function () {
  var url = 'https://api.github.com/users/gokulkrishh/repos?sort=updated';

  $.get(url)
  .success(function (response) {
    response.map(function (repo, index) {
      return(
        $('#main').append(
          "<div class=\"container\">" +
          "<p> Name: " + repo.name + "</p>" +
          "<p> Star: " + repo.stargazers_count + "</p>" +
          "<p> Fork: " + repo.forks_count + "</p>" +
          "</div>"
        )
      );
    });
  })
  .error(function (error) {
    console.log(error);
  });
});
