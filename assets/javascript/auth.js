$(document).ready(function(){
	firebase.initializeApp(config);
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
		$("#myModal").modal('hide');
		$("#signOut").addClass("showLogout");
		clearFields();
	}

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	loginFlow();
	    console.log(user);
	  } else {
	  	modalCall();
	    console.log("no user");
	  }
	});


	$("#signUp").on("click", function(event) {
		event.preventDefault();

		emailA = $("#emailA").val();
		emailB = $("#emailB").val();
		passwordA = $("#passwordA").val();
		passwordB = $("#passwordB").val();

		if (isValidEmail(emailA) === true) {
			if (doTheyMatch(emailA, emailB) === true){
				if (passwordA.length > 7){
					console.log(passwordA.length > 7);
					if(doTheyMatch(passwordA, passwordB) === true) {
						firebase.auth().createUserWithEmailAndPassword(emailA, passwordA)
							.then(function(user) {
								loginFlow();
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
					console.log(user.email);
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

	$("#signOut").on("click", function(event) {
		event.preventDefault(event);

		firebase.auth().signOut().then(function() {
		  console.log("Sign Out Successful");
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