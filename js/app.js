//To show/hide loading indicator
function toggleSpinner() {
  var $ele = $('.loading');

  if ($ele.hasClass("hide")) {
    $ele.removeClass("hide");
  }
  else {
    $ele.addClass("hide");
  }
}

//To call hackerNews API
$(function () {
  if (!navigator.onLine) {
    $("#turn-on-notification").attr("disabled", true);
    $(".custom-checkbox").addClass("offline");
    toggleSpinner();
  }
  else {
    getStories();
  }

  function getStories() {
    var url = "https://hacker-news.firebaseio.com/v0/newstories.json";

    $.ajax({
      url: url,
      method: "GET",
      success: function (response) {
        var response = response.splice(1, 20);
        response.map(function (contentId) {
          return(getContents(contentId));
        });

        toggleSpinner(); //To hide spinner
      },
      error: function (error) {
        console.error(error);
      }
    });
  }

  //To get stories in hackerNews
  function getContents(contentId) {
    var contentUrl = "https://hacker-news.firebaseio.com/v0/item/" + contentId + ".json";

    $.ajax({
      url: contentUrl,
      method: "GET",
      success: function (response) {
        $("#main").append(
          "<div class='container'>" +
          "<p><a href='#'>" + response.title + "</a></p>" +
          "<p> <span>" + response.score + "</span> point by <span class='author'>" + response.by + "</span></p>" +
          "<a href='https://www.google.co.in/search?q=" + response.title + "' target='_blank' class='search-web'> search  web</a>" +
          "</div>"
        );
      },
      error: function (error) {
        console.error(error);
      }
    });
  }

  //Hamburger menu function
  $("#menu-overlay, .menu-icon, #menu a").on("click", function (event) {
    event.stopPropagation();

    var $menuEle = $('#menu');

    if ($menuEle.hasClass("visible")) {
      $menuEle.removeClass("visible");
      $("#menu-overlay").removeClass("visible");
    }
    else {
      $menuEle.addClass("visible");
      $("#menu-overlay").addClass("visible");
    }

  });


  //To find device is online/offline
  //Online/offline event cb
  function onLineStatus(event) {
    console.log("Online: ", navigator.onLine);
    if (navigator.onLine) {
      $("#sw-offline-state").attr("data-offline", false);
      $("#sw-offline-state").html("✕");
      $("#turn-on-notification").attr("disabled", false);
      $(".custom-checkbox").removeClass("offline");
    }
    else {
      $("#sw-offline-state").attr("data-offline", true);
      $("#sw-offline-state").html("✓");
    }
  }

  window.addEventListener("online", onLineStatus);
  window.addEventListener("offline", onLineStatus);
});
