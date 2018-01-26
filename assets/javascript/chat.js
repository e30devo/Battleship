$(document).ready(function() {
  var database = firebase.database();

  $(".chatbox").keyup(function(event) {
    if (event.keyCode === 13) {
      $(".chatbox").click();

      var message = $(".chatbox").val();
      var thisGame = $(".hideLogout").attr("data-game");
      var thisPlayer = $(".hideLogout").attr("data-player");
      var myOpponent = "";

      if (thisPlayer === "playerOne") {
        myOpponent = "playerTwo";
        myPath = thisGame + "/playerOne";
        opPath = thisGame + "/playerTwo";
      } else {
        myOpponent = "playerOne";
        myPath = thisGame + "/playerTwo";
        opPath = thisGame + "/playerOne";
      }

      database.ref().on("child_added", function(snapshot) {
        var opponentExists = snapshot.child(myOpponent).exists();

        if (opponentExists) {
          database.ref("/" + thisGame + "/chat").push({
            message: [thisPlayer] + ": " + message
          });

          //clears chatbox for next message
          $(".chatbox").val("");
        } //if closer
      }); //database.ref.on child_added
    } //if event.keyCode closer
  }); //.chatbox.keyup closer

  //Needed to reset these variables inside a function, thisGame returns
  //undefined on page load due to FB latency.
  database.ref().on("value", function(snapshot) {
    var thisGame = $(".hideLogout").attr("data-game");
    var chatReference = database.ref("/" + [thisGame] + ["/chat"]);

    chatReference.on("value", function(snapshot) {
      if (snapshot.val()) {
        var uniqueChatMessage = Object.keys(snapshot.val());
        $(".chatHistory").empty();
        for (var i = 0; i < snapshot.numChildren(); i++) {
          $(".chatHistory").prepend(
            "<li class='list-group-item'>" +
              snapshot.val()[uniqueChatMessage[i]]["message"] +
              "</li>"
          );
        } //for loop closer
      }
    }); //chatReference.on closer
  }); //database.ref closer
}); //document.ready closer
