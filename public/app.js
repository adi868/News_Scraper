$(document).ready(() => {
  // Document Events
  $(document).on('click', '#scrapeNew', displayArticles);
  $(document).on("click", "#deleteArticles", deleteArticles);
  // $(document).on("click", ".save", SaveArticle);

  // function scrapeArticles() {
  //   $.getJSON("/api/scrape").then(function (data) {
  //     displayArticles()
  //     console.log("Scrape successful")
  //   })
  // }

  // function scrapeArticles() {
  //   $.getJSON("/api/articles").then(function (data) {
  //     displayArticles()
  //     console.log("Scrape successful")
  //   })
  // }

  function displayArticles() {
    // Grab the articles as a json, for each one
    $.getJSON("/articles", function (data) {
      for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + data[i].body+ "</p>");
        console.log("display scrape")
      }
    })
  }
})