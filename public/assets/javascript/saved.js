$(document).ready(function () {
  window.onload = showSavedArticles;
  // $(document).on("click", ".delete-note", deleteNote);
  // $(document).on("click", ".delete", articleNotes);
  $(document).on("click", ".delete", deleteSaved);
  $(document).on("click", ".show-note", showNote);
  // $(document).on("click", ".btn.save", handleNoteSave);
  // $(document).on("click", ".btn.note-delete", handleNoteDelete);

  function showSavedArticles() {
    $.getJSON("/api/saved-articles", function (data) {
      //div rendering all the articles in
      $("#savedArticles").empty()
      //if we have headlines, render them to the page
      if (data && data.length) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the information on the page
          var article = $("<div class = 'newsArticle'>").append("<h3> <a class = 'articleTitle' href =" + data[i].link + "'>" + data[i].title + "</a></h3>")
            .append("<p class = 'newsSummary'>" + data[i].body + "</p>")
            // .append("<p class='article-img' alt='article image'>" + data[i].image + "</p>")
            .append("<a href='#' class='btn btn-info btn-lg delete'><span class='glyphicon glyphicon-floppy-save'></span> Delete From Saved</a>")
            .append("<a href='#' class='btn btn-info btn-lg show-note'><span class='glyphicon glyphicon-plus'></span> View/Add Note</a>");
          article.data("_id", data._id)
          $("#savedArticles").append(article)
        }
      } else {
        showEmpty();
      }
    })
  }

  function showEmpty() {
    $("#savedArticles").empty();
    var empty = $(
      [
        "<div class='alert alert-info text-center'>",
        "<h4>Uh Oh. Looks like there's no saved articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h5>Would You Like to Browse Available Articles?</h5>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h5><a href='/'>Browse Articles</a></h5>",
        "</div>",
        "</div>"
      ].join("")
    );
     $("#savedArticles").append(empty)
  }

    function showNote(){
    console.log("Add Note Clicked")
    $(".modal").modal();
    }
//add delete note comment

  function deleteSaved() {
    console.log("Unsave Clicked!")
    var savedArticle = $(this).data("id");
    console.log(savedArticle);
    $(this)
      .parents(".newsArticle")
      .remove();
    $.ajax({
      method: "PUT",
      url: "/api/unsave/" + savedArticle,
    }).then(function (data) {
      if (!data.saved) {
        console.log("unsaved")
      }
    });
  }
});