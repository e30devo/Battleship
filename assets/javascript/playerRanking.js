$(document).ready(function() {

var database = firebase.database();
var stats = {};
var ranked = {};
var output = {};

	database.ref("/users").on("child_changed", function (snapshot) {

		var uid = snapshot.ref.key; //get user ID for later

		var losses = snapshot.child("losses").val(); //get losses
		var wins = snapshot.child("wins").val(); // get wins

		var rank = wins / (losses + wins); // calculat win/loss percentage
		
		if (!isNaN(rank)) {
			database.ref("/users/" + uid).update({
				average: rank
			})
		} else {
			database.ref("/users/" + uid).update({
				average: 0
			})
		}


	})

	database.ref("/users").on("value", function(snapshot) {
		snapshot.forEach(function(child) {
			console.log(child.child("average").val());
			var email = child.child("email").val();
			var average = child.child("average").val();
			stats[email] = average;
		});
		console.log(stats);

	})


	function sort() {
		ranked = Object.keys(stats).sort(function(a,b){return stats[a]-stats[b]});
	
		for (i = 0; i < ranked.length; i++) {
			var obj = ranked[i];
			output[obj] = stats[obj];
		}
	
		console.log(output);

		//writing to DOM
		var table = $(".ranking-table");
		var row = table.insertRow(0);
		var placeCell = row.insertCell(0);
		var userCell = row.insertCell(1);
		var averageCell = row.insertCell(2);

		for (j = 0; j < output.length; j++) {
			var place = j+1;

			placeCell.innerHTML = placeCell;
			userCell.innerHTML = "User";
			averageCell.innerHTML = output[j];
		}
	}
	
	sort();

	setTimeout(sort, 5000); // required since firebase calls are asynchronous, need to give firebase a chance to send back the data


});
