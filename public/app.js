//grab articles as json//
$.getJSON("/articles", function (data) {
  for (let i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>"); 
  }
});

//when a 'p' tag is clicked//
$(document).on("click", "p", function() {
  //empty notes from note section//
  $("#comments").empty();
  //id saved from p tag//
  const thisId = $(this).attr("data-id");

  //ajax call for Article//
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    //add comment info to page//
    .then(function(data) {
      console.log(data);
      //TITLE//
      $("comments").append("<h2>" + data.title + "</h2>");
      //INPUT TO ENTER NEW TITLE//
      $("#comments").append("<input id='titleinput' name='title' >");
      //TEXTAREA TO ADD NEW COMMENT BODY//
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      //SUB BUTTON FOR NEW COMMENT WITH ARTICLE ID SAVED//
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

      //IF NO COMMENT IN ARTICLE//
      if (data.comment) {
        $("#titleinput").val(data.comment.title);
        $("bodyinput").val(data.note.body);
      }
    });
});

//WHEN SAVECOMMENT BTTN CLICKED//
$(document).on("click", "#savecomment", function() {
  const thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val() 
    }
  })
    .then(function(data) {
      console.log(data);
      $("#comments").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});