$(document).ready(() => {
  $(document).on("click", "#scrapeNew", displayArticles);
  $(document).on("click", "#deleteArticles", deleteArticles);
  $(document).on("click", ".save", saveArticle);
  
  function displayArticles() {
    $("#articles").empty();
    // Grab the articles as a JSON, for each one
    $.getJSON("/articles", function(data) {
      if (data && data.length) {
        for (var i = 0; i < data.length; i++) {
          var article = $("<div class = 'newsArticle'>")
            .append(
              "<h3> <a class = 'articleTitle' href =" +
                data[i].link +
                "'>" +
                data[i].title +
                "</a></h3>"
            )
            .append("<p class = 'newsSummary'>" + data[i].body + "</p>")
            // .append("<p class='article-img' alt='article image'>" + data[i].image + "</p>")
            .append(
              `<a href='#' class='btn btn-info btn-lg save' data-id=${data[i]._id}><span class='glyphicon glyphicon-floppy-save'></span> Save Article</a>`
            );
          article.data("_id", data._id);
          $("#articles").append(article);
          console.log("Display Scrape");
        }
      } else {
        showEmpty();
      }
    });
  }
});

function showEmpty() {
  $("#articles").empty();
  var empty = $(
    [
      "<div class='alert alert-info text-center'>",
      "<h4>Uh Oh. Looks like there's no new articles.</h4>",
      "</div>",
      "<div class='card'>",
      "<div class='card-header text-center'>",
      "<h5>Try Scraping New Articles! Or<a href='/saved'> Go to Saved Articles</a></h5>",
      "</div>",
      "</div>"
    ].join("")
  );
  $("#articles").append(empty);
}

function deleteArticles() {
  $("#articles").empty();
}

function saveArticle() {
  console.log("Save Clicked");
  console.log(this);
  var dataId = $(this).data("id");
  console.log(dataId);
  $(this)
    .parents(".newsArticle")
    .remove();
  $.ajax({
    method: "POST",
    url: "/api/save/" + dataId,
  }).then(function(data) {
    if (data.saved) {
      console.log("saved");
      initPage();
    }
  });
}
