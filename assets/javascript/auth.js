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

	function loginFlow(user) {
		$("#myModalSignIn").modal('hide');
		$("#myModalSignUp").modal('hide');
		$("#signOut").addClass("showLogout");
		var handle = user.email;
		handle = handle.substring(0, handle.indexOf("@"));
		$("#user-email").text(handle);

		clearFields();
	}

	// builds player profile in database
	function registerUser(user) {
		var userEmail = user.email;
		var UID = user.uid;
		database.ref("/users/" + UID).update({
				email: userEmail,
				wins: 0,
				losses: 0,
		});
	}

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	loginFlow(user);
	  } else {
	  	modalCall();
	    console.log("No User");
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
						  				$(".userPrompt").append("<p class='prompt'>Email Already In Use</p>");
										break;
									default:
										console.log(error.code);
						  		}
								
						});
					} else {
						$(".userPrompt").append("<p class='prompt'>Your Passwords Do Not Match</p>");
					}
				} else {
					$(".userPrompt").append("<p class='prompt'>Your Password Is Less Than 8 Characters</p>");
				}
			} else {
				$(".userPrompt").append("<p class='prompt'>Your Emails Do Not Match</p>");
			}
		} else {
			$(".userPrompt").append("<p class='prompt'>Invalid Email Address</p>");
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
							$(".userPrompt").append("<p class='prompt'>Incorrect Email or Password</p>");
							break;
						case "auth/wrong-password":
							$(".userPrompt").append("<p class='prompt'>Incorrect Email or Password</p>");
						default:
							console.log(error.code);
					}
			});
			} else {
				$(".userPrompt").append("<p class='prompt'>Invalid Email Address</p>");
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
		$("#myModalSignIn").modal('hide');
		$("#myModalSignUp").modal(freezeModal);
		$(".userPrompt").empty();
		console.log("switch");
	});

	$(".signInSwitch").on("click", function(){
		$("#myModalSignIn").modal(freezeModal);
		$("#myModalSignUp").modal('hide');
		$(".userPrompt").empty();
		console.log("switch");
	});


});