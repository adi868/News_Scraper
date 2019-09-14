$(document).ready(function () {
    window.onload = showSavedArticles;
    // $(document).on("click", ".delete-note", deleteNote);
    // $(document).on("click", ".delete", articleNotes);
    $(document).on("click", ".delete", deleteSaved);
  
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
            .append("<a href='#' class='btn btn-info btn-lg delete'><span class='glyphicon glyphicon-floppy-save'></span> Delete From Saved</a>");
          article.data("_id", data._id)
            $("#savedArticles").append(article)
          }
        }
        else {
          showEmpty();
        }
      })
    }
  
    function showEmpty() {
        $("#showArticles").empty();
        var empty = $(`<div class="alert alert-primary" role="alert"> Looks like there's no saved articles.</div>`)
        $("#showArticles").append(empty)
      }
  
    // $(document).on("click", ".add-note", function() {
    //   $("#modal1").empty();
    //   $('#modal1').modal('open');
    //   var thisId = $(this).attr("data-id");
    //   console.log(thisId)
    //   $.ajax({
    //     method: "GET",
    //     url: "/api/articles/" + thisId
    //   })
    //     .then(function(data) {
    //       console.log(data);
    //       var modalText = `<div class="modal-content container">
    //        <div class="row">
    //               <form class="col s12">
    //                  <div class="row">
    //                  <h4>Notes For Article: ${data._id} </h4>
    //                 <hr>
    //                 <ul class='list-group note-container'></ul>
    //                    <div class="input-field col s12">
    //                      <i class="material-icons prefix">mode_edit</i>
    //                     <textarea id="icon_prefix2" class="materialize-textarea notes"></textarea>
    //                      <label for="icon_prefix2">New Note</label>
    //                      <hr>
    //                      <a class="modal-close waves-effect waves-light btn modal-trigger right save-note" data-id= ${data._id}>Save Note</a>
    //                    </div>
    //                  </div>
    //                </form>
    //        </div>
    //        </div>`
    //       $("#modal1").append(modalText);
    //       if (data.note) {
    //       console.log("length is:",data.note.length)
    //       $(".note-container").append("<li class='list-group-item center-align'><h8>" + data.note.body + "</h8><a><i class='material-icons right delete-note' data-id='" + data.note._id + "'>clear</i></a></li>");
    //         console.log("=========================")
    //         console.log(data.note)
    //       } else {
    //         $(".note-container").append("<li class='list-group-item center-align'><h8>No notes for this article yet</h8></li>");
    //       }
    //     });
    // });
  
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
    var savedArticle = $(".articleTitle").data();
      console.log(savedArticle)
      $(this).parents(".newsArticle").remove();
      $(this).parents(".newsArticle").saved = false;
      $.ajax({
        method: "POST",
        url: "/api/unsave/" + savedArticle.id,
        data: savedArticle
      }).then(function(data) {
        if (!data.saved) {
          showSavedArticles();
        }
      });
  });