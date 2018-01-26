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

		sort();
	})

	database.ref("/users").on("value", function(snapshot) {
		snapshot.forEach(function(child) {
			var email = child.child("email").val();
			var average = child.child("average").val();
			stats[email] = average;
		});

	})


	function sort() {
		$(".playerRanking").empty();
		ranked = Object.keys(stats).sort(function(a,b){return stats[b]-stats[a]});

		$(".playerRanking").append("<thead><tr><th>Rank</th><th>Username</th><th>Win/Loss Average</th></tr></thead><tbody class='playerRankingTable'></tbody>");
		for (i = 0; i < ranked.length; i++) {
			var obj = ranked[i]; //gets email

	/*		if (stats[obj]){
				output[obj] = stats[obj]; //assigns average to the user in object	
			} else {
				output[obj] = 0; //if average is null give it a zero
			}*/

			var place = i+1;
			if (stats[obj] === null) {
				stats[obj] = 0;
			}

			$(".playerRankingTable").append("<tr><td>"+place+"</td><td>"+ranked[i]+"</td><td>"+stats[obj].toFixed(4)+"</tr>");
		}
	
		console.log(output);
		
	}


	setTimeout(sort, 1000 * 2); // required since firebase calls are asynchronous, need to give firebase a chance to send back the data


});
