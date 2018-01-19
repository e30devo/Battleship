$(document).ready(function() {
  console.log("geolocation!");

  if (navigator.geolocation) {     
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      console.log(position);
      console.log(position.coords.latitude, position.coords.longitude);

      var queryPath = "https://maps.googleapis.com/maps/api/geocode/json?";
      var latLong =
        "latlng=" + position.coords.latitude + "," + position.coords.longitude;
      var apiKey = "&key=AIzaSyBksTpvY0xaT6-AlwrAA5fZkPC4B2CyJcU";
      var locality = "&result_type|locality";

      $.ajax({
        url: queryPath + latLong + apiKey + locality,
        method: "GET"
      }).done(function(response) {
        console.log(response);

        var location = response.results[7].formatted_address;
        console.log(location);
      });
    }); //.getCurrentPosition closer
  } //if closer
}); //document.ready closer

// Add this "<script src="./assets/javascript/geolocation.js"></script>"
//to wherever you want it to pull and in this file include..
// $(blah blah).text(location); under console.log(location);
