$(document).ready(function() {

var database = firebase.database();

database.ref("/users").on("value", function (snapshot) {
	console.log("change");
	var numChildren = snapshot.numChildren();

	for (i = 0; i < numChildren; i++) {
		console.log(snapshot);
	}

})
//get player win/loss records

//sort by wins


//sort by losses


// give ranking
// if ties, players get the same ranking, next player get nth ranking
//  if two players tied for 3rd, the next available ranking is 5th.

});
