$(document).ready(function() {
  var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var yAxis = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  var playerGrid = xAxis.length * yAxis.length;


  //interating through number of needed "positions" for player map, 
  //player ships will be set here.
  for (var i = 0; i < playerGrid; i++) {
    var div = $("<div>");
    var img = $("<img>");
    var imgSrc = "./assets/images/waterTile.jpg";    
    img.addClass("water");
    img.attr("src", imgSrc);
    img.attr("data", [i]);    
    div.append(img);
    $(".player").append(div);
  }

  //interating through number of needed "positions" for opponent map, 
  //opponent ships will be in play in "storage", once set.
  for (var i = 0; i < playerGrid; i++) {
    var div = $("<div>");
    var img = $("<img>");
    var imgSrc = "./assets/images/waterTile.jpg";
    var optImg = "./assets/images/fireTile.jpg";
    img.addClass("opponentWater");
    img.attr("src", imgSrc);
    img.attr("data", [i]);
    img.attr("option", optImg)
    div.append(img);
    $(".opponent").append(div);
  }


  // this code indicates a selection and returns an action, disables on click handler after click.
  $("img").on("click", function() {
    var src = $(this).attr("src");
    var optImg = $(this).attr("option");
    $(this).css("opacity", "1.0");
    $(this).unbind("click");

    //this code will return img as a hit once ships are mapped.
    // $(this).attr("option", optImg.replace(optImg, src));
    // $(this).attr("src", src.replace(src, optImg));
    

  }) //img on.click handler close

}); //document.ready close
