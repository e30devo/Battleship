
firebase.initializeApp(config);

var database = firebase.database();
var email;
var password;

function eatCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i=0; i< ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) {
			return c.substring(nameEQ.length, c.length);
		}
	return null;
	}
}
console.log(eatCookie("name"));
bakeCookie();

function bakeCookie(){
	document.cookie = "name=nema;";
	console.log(document.cookie);

}
$(document).ready( function() {


	$("#myModal").modal(/*{backdrop: 'static', keyboard: false}*/); //uncommented for testing

});



/*$('#myModal').on('shown.bs.modal', function () {
  
});*/
/*
$("#signUp").on("click", function(event) {
	event.preventDefault();

	email = $("#email").val();
	password = $("#password").val();

		if (!!email) {
		database.ref("/users/" + email).update({
			wins: 0,
			losses: 0,
			rank: 0
		});
	}

	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;
	});
});


$("#signIn").on("click", function(event) {
	event.preventDefault(event);


	email = $("#email").val();
	password = $("#password").val();

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	});
});

$("#signOut").on("click", function(event) {
	event.preventDefault(event);


	firebase.auth().signOut().then(function() {
	  console.log("Sign Out Successful");
	}).catch(function(error) {
	  console.log("Sign Out Failed");
	});

});*/