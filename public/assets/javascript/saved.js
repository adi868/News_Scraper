$(document).ready(function () {
  window.onload = showSavedArticles;
  // $(document).on("click", ".delete-note", deleteNote);
  // $(document).on("click", ".delete", articleNotes);
  $(document).on("click", ".delete", deleteSaved);
  $(document).on("click", ".add-note", addNote);

  function showSavedArticles() {
    $.getJSON("/api/saved-articles", function (data) {
      $("#savedArticles").empty()
      if (data && data.length) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the information on the page
          var article = $("<div class = 'newsArticle'>").append("<h3> <a class = 'articleTitle' href =" + data[i].link + "'>" + data[i].title + "</a></h3>")
            .append("<p class = 'newsSummary'>" + data[i].body + "</p>")
            // .append("<p class='article-img' alt='article image'>" + data[i].image + "</p>")
            .append("<a href='#' class='btn btn-info btn-lg delete'><span class='glyphicon glyphicon-floppy-save'></span> Delete From Saved</a>")
            .append("<a href='#' class='btn btn-info btn-lg add-note'><span class='glyphicon glyphicon-plus'></span>Add Note</a>");
          article.data("_id", data._id)
          $("#savedArticles").append(article)
        }
      } else {
        showEmpty();
      }
    })
  }

  function showEmpty() {
    $("#showArticles").empty();
    var empty = $(`<div class="alert alert-primary" role="alert"> Looks like there's no saved articles.</div>`)
    $("#showArticles").append(empty)
  }

    function addNote(){
    console.log("Add Note Clicked")
    $("#modalBox").empty();
    $('#modalBox').modal('open');
    var noteId = $(this).data("id");
    console.log(noteId)
    $.ajax({
      method: "GET",
      url: "/api/articles/" + noteId
    })
      .then(function(data) {
        console.log(data);
        var modal = `<div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modal title</h5>
              <h4>Notes For Article: ${data._id} </h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary">Save changes</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>`
        $("#modalBox").append(modal);
        // if (data.note) {
        // console.log("length is:",data.note.length)
        // $(".note-container").append("<li class='list-group-item center-align'><h8>" + data.note.body + "</h8><a><i class='material-icons right delete-note' data-id='" + data.note._id + "'>clear</i></a></li>");
        //   console.log("=========================")
        //   console.log(data.note)
        // } else {
        //   $(".note-container").append("<li class='list-group-item center-align'><h8>No notes for this article yet</h8></li>");
        // }
      });
    }


  // $(document).on("click", ".save-note", function() {
  //   var thisId = $(this).attr("data-id");
  //   $.ajax({
  //     method: "POST",
  //     url: "/articles/" + thisId,
  //     data: {
  //       body: $(".notes").val().trim()
  //     }
  //   })
  //     .then(function(data) {
  //       console.log(data);
  //       $(".notes").empty();
  //     });
  // });

  // function deleteNote() {
  //   var noteToDelete = $(this).attr("data-id");
  //   $.get("/api/notes/" + noteToDelete).then(function() {
  //     $("#modal1").modal('close');
  //   });
  // }

  function deleteSaved() {
    console.log("Unsave Clicked!")
    var savedArticle = $(this).data("id");
    console.log(savedArticle);
    $(this)
      .parents(".newsArticle")
      .remove();
    $.ajax({
      method: "POST",
      url: "/api/unsave/" + savedArticle,
    }).then(function (data) {
      if (!data.saved) {
        showSavedArticles();
        console.log("unsaved")
      }
    });
  }
});