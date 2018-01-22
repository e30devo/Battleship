$(document).ready(function() {
  var database = firebase.database();
  var thisGame = $(".hideLogout").attr("data-game");

  $(".chatbox").keyup(function(event) {
    if (event.keyCode === 13) {
      $(".chatbox").click();

        var message = $(".chatbox").val();
        var thisGame = $(".hideLogout").attr("data-game");

        database.ref("/" + thisGame + "/chat").push({
          message: message
        });

        //clears chatbox for next message
        $(".chatbox").val("");      
    } //if closer
  }); //.chatbox.keyup closer

  //Needed to reset these variables inside a function, thisGame returns
  //undefined on page load due to FB latency.
  database.ref().on("value", function(snapshot) {
    var thisGame = $(".hideLogout").attr("data-game");
    var thisPlayer = $(".hideLogout").attr("data-player");
    var chatReference = database.ref("/" + [thisGame] + ["/chat"]);

    chatReference.on("value", function(snapshot) {
      var uniqueChatMessage = Object.keys(snapshot.val());
      $(".chatHistory").empty();
      for (var i = 0; i < snapshot.numChildren(); i++) {
        $(".chatHistory").prepend(
          "<li class='list-group-item'>" + thisPlayer + ": " +
            snapshot.val()[uniqueChatMessage[i]]["message"] + "</li>");
      } //for loop closer
    }); //chatReference.on closer
  }); //database.ref closer
}); //document.ready closer
