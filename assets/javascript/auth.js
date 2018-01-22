$(document).ready(function(){
	
	var auth = firebase.auth();
	var database = firebase.database();
	var email;
	var password;
	var freezeModal = {backdrop: 'static', keyboard: false};
	
	function isValidEmail(email) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		} else {
			return false;
		}
	};

	function doTheyMatch(entryA, entryB) {
		if (entryA === entryB) {
			return true;
		} else {
			return false;
		}
	}

	function clearFields() {
		$("#emailA").val("");
		$("#emailB").val("");
		$("#email").val("");
		$("#passwordA").val("");
		$("#passwordB").val("");
		$("#password").val("");
	}

	function modalCall() {
		$("#myModalSignIn").modal(freezeModal);
		$("#signOut").removeClass("showLogout");
	};

	function loginFlow() {
		$("#myModalSignIn").modal('hide');
		$("#myModalSignUp").modal('hide');
		$("#signOut").addClass("showLogout");
		clearFields();
	}

	function registerUser(user) {
		var userEmail = user.email;
		var UID = user.uid;
		console.log(user)
		console.log("hey now! " + userEmail);
		console.log("hey now!!" + UID);
		database.ref("/users/" + UID).update({
				email: userEmail,
				wins: 0,
				losses: 0,
		});
		// database.ref("/users").push(UID);
		// databse.ref("/users/" + UID).update({
		// 	wins: 0,
		// 	losses: 0,
		// })
		
	}

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	loginFlow();
	  } else {
	  	modalCall();
	    console.log("no user");
	  }
	});


	$("#signUp").on("click", function(event) {
		event.preventDefault();
		$(".userPrompt").text("");
		emailA = $("#emailA").val();
		emailB = $("#emailB").val();
		passwordA = $("#passwordA").val();
		passwordB = $("#passwordB").val();

		if (isValidEmail(emailA) === true) {
			if (doTheyMatch(emailA, emailB) === true){
				if (passwordA.length > 7){
					if(doTheyMatch(passwordA, passwordB) === true) {
						firebase.auth().createUserWithEmailAndPassword(emailA, passwordA)
							.then(function(user) {
								loginFlow();
								registerUser(user);
							
							})
							.catch(function(error) {
						  		switch (error.code) {
						  			case "auth/email-already-in-use":
						  				$(".userPrompt").text("Email Already In Use");
										break;
									default:
										console.log(error.code);
						  		}

						});
					} else {
						$(".userPrompt").text("Your Passwords Do Not Match");
					}
				} else {
					$(".userPrompt").text("Your Password Is Less Than 8 Characters");
				}
			} else {
				$(".userPrompt").text("Your Emails Do Not Match");
			}
		} else {
			$(".userPrompt").text("Invalid Email Address");
		}
		
	});


	$("#signIn").on("click", function(event) {
		event.preventDefault(event);
		email = $("#email").val();
		password = $("#password").val();

		if (isValidEmail(email) === true){ 
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then(function(user) {
					$("#myModalSignIn").modal('hide');
				})
				.catch(function(error) {
					switch (error.code) {
						case "auth/user-not-found":
							$(".userPrompt").text("Incorrect Email or Password");
							break;
						case "auth/wrong-password":
							$(".userPrompt").text("Incorrect Email or Password");
						default:
							console.log(error.code);
					}
			});
			} else {
				$(".userPrompt").text("Invalid Email Address");
			}
		
		
		
	});

	$("#signOut").on("click", function() {
        var whoAmI = $(this).attr("data-whoami");
        firebase.auth().signOut().then(function() {
          console.log("Sign Out Successful");
          database.ref(whoAmI).remove();
        }).catch(function(error) {
          console.log("Sign Out Failed");
        });

    });

	//switch to sign up
	$(".signUpSwitch").on("click", function(){
		$("#myModalLogin").modal('hide');
		$("#myModalSignUp").modal(freezeModal);
		console.log("switch");
	});

	$(".signInSwitch").on("click", function(){
		$("#myModalLogin").modal(freezeModal);
		$("#myModalSignUp").modal('hide');
		console.log("switch");
	});


});