$(document).ready(function() {
  var database = firebase.database();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      // console.log(position); //Leave in for debugging
      // console.log(position.coords.latitude, position.coords.longitude); //Leave in for debugging

      var queryPath = "https://maps.googleapis.com/maps/api/geocode/json?";
      var latLong =
        "latlng=" + position.coords.latitude + "," + position.coords.longitude;
      var apiKey = "&key=AIzaSyBksTpvY0xaT6-AlwrAA5fZkPC4B2CyJcU";
      var locality = "&result_type|locality";

      $.ajax({
        url: queryPath + latLong + apiKey + locality,
        method: "GET"
      }).done(function(response) {
        // console.log(response); //Leave in for debugging

        var location = response.results[7].formatted_address;        
        var thisGame = $(".hideLogout").attr("data-game");
        var thisPlayer = $(".hideLogout").attr("data-player");
        var geoLocationRef = database.ref(
          "/" + [thisGame] + "/" + [thisPlayer] + ["/geolocation"]
        );

        geoLocationRef.update({
          location
        });

        $(".location").html(location);

        var myOpponent = "";

        if (thisPlayer === "playerOne") {
          myOpponent = "playerTwo";
          myPath = thisGame + "/playerOne";
          opPath = thisGame + "/playerTwo/geolocation";
        } else {
          myOpponent = "playerOne";
          myPath = thisGame + "/playerTwo";
          opPath = thisGame + "/playerOne/geolocation";
        }
        
        database.ref(opPath).on("value", function(snapshot) {
          
          if (snapshot.val()) {
            var opponentLocation = snapshot.val()["location"];
            $(".opponentLocation").text(opponentLocation);            
          }
        }); //database.ref.on.child_added closer
      }); //.done function closer
    }); //.getCurrentPosition closer
  } //if closer
}); //document.ready closer

// Add this "<script src="./assets/javascript/geolocation.js"></script>"
//to wherever you want it to pull and in this file include..
// $(blah blah).text(location); under console.log(location);
