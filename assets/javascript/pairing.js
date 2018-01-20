$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyByKWWnishzXkEbqb5IcHFMZhLOJNwImrs",
        authDomain: "myfirstproject-bb1fa.firebaseapp.com",
        databaseURL: "https://myfirstproject-bb1fa.firebaseio.com",
        projectId: "myfirstproject-bb1fa",
        storageBucket: "myfirstproject-bb1fa.appspot.com",
        messagingSenderId: "11954546478"
    };
    firebase.initializeApp(config);
    console.log("working");
    // Create a variable to reference the database.
    var database = firebase.database();

    var userSignedIn = "nobody";
    var userEmail;
    var userUID;

    console.log("On page load, userSigned in is: " + userSignedIn);

    // takes the user email and pasword from the log in form
    $(".login form").on("submit", function(event){
        event.preventDefault();
        // sets the info to variables
        var email = $(".login .email").val();
        var password = $(".login .password").val();
        //uses the info from the form to sign in to firebase
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(user){
                console.log(user);
            })
            .catch(function(err) {
                consol.log(err);
            })
    
        // gets the current user and assigns them to an object variable userSignedIn
        firebase.auth().onAuthStateChanged(function(userSignedIn) {
            if (userSignedIn) {
            // pulls user email and unique ID fron the returned user object
            userEmail = userSignedIn.email;
            userUID = userSignedIn.G
                console.log(userEmail);
                console.log(userUID);
            // calls the assignGame function
            assignGame();
            } else {
            // No user is signed in console logs...well you see
            console.log("no user signed in");
            
            };
        });
    });
    // functions logs out the current user in the browser
    $(".logOut").on("click", function(event) {
        event.preventDefault();
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
          }, function(error) {
            console.error('Sign Out Error', error);
          });
          
    })

    // this function runs a loop that assigns the player to a game
    function assignGame(){
        // takes a snapshot of the current database
        database.ref().once("value", function(snapshot) {
            // runs a hard set for loop that will create or check no more than 10 games
            for (var i = 1; i < 11; i++) {
                // sets an existence check to the existence of a game branch numbered Game "i"
                var gameExists = snapshot.child("/Game " + "'" + i + "'").exists();
                var gamePlayers = snapshot.child("/Game " + "'" + i + "'").numChildren();
                // if that game number does NOT exists, it is created and the user is place as player one and for loop exits
                if (!gameExists) {
                database.ref("/Game " + "'" + i + "'").update({
                    playerOne: userEmail,
                })   
                return
                }
                // if the game DOES exists AND there are less than two player in it, user is placed in game at player two
                else if (gameExists && gamePlayers < 2) {
                    if (playerTwoExists) {
                        database.ref("/Game " + i).update({
                        playerOne: userEmail,
                        })
                        return
                    }
                    else {
                        database.ref("/Game " + i).update({
                            playerTwo: userEmail,
                        })   
                        return
                    }
                }
            }
        })
    }
});