$(document).ready(function() {

    /*console.log("working");*/
    // Create a variable to reference the database.
    var database = firebase.database();
    var gamePath = "";
    var userSignedIn = "nobody";
    var userEmail;
    var userUID;


	var shipId;

	var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var yAxis = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

	var playerGrid = xAxis.length * yAxis.length;

	var database = firebase.database();

	$('.screen img').detach();

	var opShip =[];

	var myGame = '';
	var myRole = '';
	var myOpponent = '';
	var myPath = '';
	var opPath = '';

    /*console.log("On page load, userSigned in is: " + userSignedIn);*/
    firebase.auth().onAuthStateChanged(function(userSignedIn) {
        if (userSignedIn) {
            // pulls user email and unique ID fron the returned user object
            userEmail = userSignedIn.email;
            userUID = userSignedIn.G
                /*console.log(userEmail);
                console.log(userUID);*/
            // calls the assignGame function
            assignGame();
            } else {
            // No user is signed in console logs...well you see
            console.log("No User Signed In");
        }
    });

    // this function runs a loop that assigns the player to a game
    function assignGame(){


        // takes a snapshot of the current database
        database.ref().once("value", function(snapshot) {
            // runs a hard set for loop that will create or check no more than 10 games
            for (var i = 1; i < 11; i++) {
                // sets an existence check to the existence of a game branch numbered Game "i"
                var gameExists = snapshot.child("/Game_" + i).exists();
                var gamePlayers = snapshot.child("/Game_" + i).numChildren();
                var playerTwoExists = snapshot.child("/Game_" + i + "/playerTwo").exists();
                var playerOneExists = snapshot.child("/Game_" + i + "/playerOne").exists();
                // if that game number does NOT exists, it is created and the user is place as player one and for loop exits

                /*if ( !playerOneExists && !playerTwoExists) {
                    database.ref("/Game_" + i).remove();
                }*/

                if (!gameExists) {
                database.ref("/Game_" + i + "/playerOne").update({
                    email: userEmail,
                    guess: 0,
                })

                // database.ref("Game_" + i + "/chat").push({
                //     message: "Begin smack talk!",
                // })

                $(".playerName").html(userEmail);
                gamePath = "/Game_" + i + "/playerOne";
                database.ref("/Game_" + i + "/chat").onDisconnect().remove();
                database.ref(gamePath).onDisconnect().remove();
                $("#signOut").attr("data-whoami", gamePath);
                var game = "Game_" + i;
                var player = "playerOne";
                $("#signOut").attr("data-game", game);
                $("#signOut").attr("data-player", player);
				create_path(game, player);

                return
                }
                // if the game DOES exists AND there are less than two player in it, user is placed in game at player two
                else if (gameExists && gamePlayers < 3) {
                    // if playerTwo already exists new player is placed at playerOne
                    if (playerTwoExists) {
                        database.ref("/Game_" + i + "/playerOne").update({
                            email: userEmail,
                            guess: 0,
                        })


                        $(".playerName").text(userEmail);

                        gamePath = "/Game_" + i + "/playerOne";
                        database.ref("/Game_" + i + "/chat").onDisconnect().remove();
                        database.ref(gamePath).onDisconnect().remove();
                        $("#signOut").attr("data-whoami", gamePath);
                        var game = "Game_" + i;
                        var player = "playerOne";
                        $("#signOut").attr("data-game", game);
                        $("#signOut").attr("data-player", player);
						create_path(game, player);

                        return
                    }
                    else {
                        database.ref("/Game_" + i + "/playerTwo").update({
                            email: userEmail,
                            guess: 0,
                        })

                        gamePath = "/Game_" + i + "/playerTwo";
                        database.ref("/Game_" + i + "/chat").onDisconnect().remove();

                        database.ref(gamePath).onDisconnect().remove();
                        $("#signOut").attr("data-whoami", gamePath);
                        var game = "Game_" + i;
                        var player = "playerTwo";
                        $("#signOut").attr("data-game", game);
                        $("#signOut").attr("data-player", player);
						create_path(game, player);
                        return
                    }

                    database.ref("/Game_" + i + "/playerTwo").update({
                        email: userEmail,
                        guess: 0,
                    })

                        gamePath = "/Game_" + i + "/playerTwo";
                        database.ref("/Game_" + i + "/chat").onDisconnect().remove();
                        database.ref(gamePath).onDisconnect().remove();
                        $("#signOut").attr("data-whoami", gamePath);
                        var game = "Game_" + i;
                        var player = "playerTwo";
                        $("#signOut").attr("data-game", game);
                        $("#signOut").attr("data-player", player);
						create_path(game, player);
                        return gamePath
                    }

                }
            });
    }

	reset_game();
	function reset_game(){
		$('.guess').detach();
		$('.screen.player').hide();
		// $('.screen.opponent').show();

		database.ref(myPath + 'guess').remove();
		database.ref(myPath + 'ship').remove();
	}

	function create_path(game, player){
		myGame = game;
		myRole = player;

		if(myRole === 'playerOne'){
			myOpponent = 'playerTwo';
			myPath = myGame + '/playerOne/';
			opPath = myGame + '/playerTwo/';
		} else {
			myOpponent = 'playerOne';
			myPath = myGame + '/playerTwo/';
			opPath = myGame + '/playerOne/';
		}

		console.log(myGame, myRole);
		console.log(game, player);
	}

	/*-------------------------------------
	| print grid
	-------------------------------------*/

	for (var i = 0; i < xAxis.length; i++) {
		for (var j = 0; j < yAxis.length; j++) {
			var playerBlock = $('<div class="block">');
			var opponentBlock = $('<div class="block">');

			var playerGrid = $('<div class="block">');

			var water = $('<img src="./assets/images/waterTile.png">');

			playerBlock.attr('id', xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);
			playerGrid.attr('id', 'screen'+ xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);
			opponentBlock.attr('id', 'op'+xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);

			$('.board .player').append(playerBlock);
			$('.board .opponent').append(opponentBlock);
			$('.screen.player').append(playerGrid);
		}
	}

	$('.block').append(water);

	/*-------------------------------------
	| snap and rotate
	-------------------------------------*/

	var snap = $('<div class="snap">');
	$('.board .player .block').append(snap);

	$('.ship').draggable({
		snap: '.snap',
		snapMode: 'inner',
		containment: '.board .player'
	});

	$('.ship').on('click', function(){
		var rotate = $(this).attr('rotate');
		var size = $(this).attr('size');

		if (rotate === 'false') {
			$(this).attr('rotate', 'true');
			$(this).css('height',size).css('width','26px');
			// $(this).find('img').attr('src','./assets/images/ship1-v.png');
		} else {
			$(this).attr('rotate', 'false');
			$(this).css('height','26px').css('width',size);
			// $(this).find('img').attr('src','./assets/images/ship1.png');
		}
	});

	/*-------------------------------------
	| place/ confirm/ reset
	-------------------------------------*/

	$('#start').on('click', function(){
	    //
		// sessionStorage.setItem('myGame', myGame);
		// sessionStorage.setItem('myRole', myRole);

		// $('.screen.opponent').hide();
		// $('.screen.player').show();

		for(var i=1; i< 6; i++){
			shipId = 'ship'+i;

			for (var j = 0; j < xAxis.length; j++) {
				for (var k = 0; k < yAxis.length; k++) {
					var blockId = xAxis[j] + yAxis[k];
					overlap(shipId, blockId);
				}
			}
		}

		$('.screen.player').show();
		console.log(myPath, opPath);
		ship_location();
		op_hit();
	});

	/*-------------------------------------
	| check overlap
	-------------------------------------*/

	function overlap(shipId, blockId) {
		var blockDiv = $('#' +blockId);
		var shipDiv = $('#' +shipId);

		var x1 = blockDiv.offset().left;
		var y1 = blockDiv.offset().top;
		var h1 = blockDiv.outerHeight(true);
		var w1 = blockDiv.outerWidth(true);
		var b1 = y1 + h1;
		var r1 = x1 + w1;

		var x2 = shipDiv.offset().left;
		var y2 = shipDiv.offset().top;
		var h2 = shipDiv.outerHeight(true);
		var w2 = shipDiv.outerWidth(true);

		var b2 = y2 + h2;
		var r2 = x2 + w2;

		if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
			// $('#'+blockId).removeClass('occupied');
		} else {
			blockDiv.addClass('occupied').addClass(shipId);
			console.log(myPath);

			/* push block location to database -------------------------------*/
			database.ref(myPath + 'ship/' + shipId + '/'+ blockId).set({
				blockId: blockId
			});
		}
	}

	/*-------------------------------------
	| download opponent data
	-------------------------------------*/

	function ship_location(){
		database.ref(opPath + 'ship/ship1').on('child_added', function(snapshot){
			var blockIndex = snapshot.key;
			opShip.push(blockIndex);
		});

		database.ref(opPath + 'ship/ship2').on('child_added', function(snapshot){
			var blockIndex = snapshot.key;
			opShip.push(blockIndex);
		});

		database.ref(opPath + 'ship/ship3').on('child_added', function(snapshot){
			var blockIndex = snapshot.key;
			opShip.push(blockIndex);
		});

		database.ref(opPath + 'ship/ship4').on('child_added', function(snapshot){
			var blockIndex = snapshot.key;
			opShip.push(blockIndex);
		});

		database.ref(opPath + 'ship/ship5').on('child_added', function(snapshot){
			var blockIndex = snapshot.key;
			opShip.push(blockIndex);
			console.log(blockIndex)
			console.log(opShip);
			console.log(opPath);
		});
	}


	/*-------------------------------------
	| hit or miss
	-------------------------------------*/

	$(document).on('click', '.opponent .block',function(){

		op_hit();

		// $('.screen.opponent').show();
		console.log('opponent\'s turn');

		var blockIndex = $(this).attr('index');

		var hitSrc = './assets/images/hit.png';
		var missSrc = './assets/images/miss.png';

		var hit = opShip.indexOf(blockIndex);
		console.log(hit);

	/* miss -------------------------------*/
		if(hit === -1){
			$('#op'+blockIndex).find('img').attr('src', missSrc);

			database.ref(myPath + 'guess/' + blockIndex).set({
				status: 'miss'
			});
		}

	/* hit -------------------------------*/
		else {
			$('#op'+blockIndex).find('img').attr('src', hitSrc);

			var whichShip;

			if(-1< hit && hit<2){ /* 0,1---------*/
				whichShip = 'ship1';
			} else if (1< hit && hit<5){ /* 2,3,4---------*/
				whichShip = 'ship2';
			} else if (4< hit && hit<8){ /* 5,6,7---------*/
				whichShip = 'ship3';
			} else if (7< hit && hit<12){ /* 8,9,10,11---------*/
				whichShip = 'ship4';
			} else { /* 12,13,14,15,16---------*/
				whichShip ='ship5';
			}

			database.ref(myPath + 'guess/' + blockIndex).set({
				status: whichShip
			});

			database.ref(opPath + 'ship/' + whichShip + '/' + blockIndex).remove();
		}

	});

	/*-------------------------------------
	| opponent's hit
	-------------------------------------*/

	function op_hit(){
		database.ref(opPath + 'guess' ).on('child_added', function(snapshot){
			var blockIndex = snapshot.key;
			var status = snapshot.val().status;

			var hitSrc = './assets/images/hit.png';
			var missSrc = './assets/images/miss.png';

			if(status ==='miss'){
				$('#screen'+blockIndex).find('img').attr('src', missSrc);
			} else {
				$('#screen'+blockIndex).find('img').attr('src', hitSrc);
			}

			// $('.screen.opponent').hide();
			console.log('Your turn');
		});
		sink_ship();
	}

	/*-------------------------------------
	| sink and defeat
	-------------------------------------*/

	function sink_ship(){
		database.ref(opPath + 'ship' ).on('child_removed', function(oldChildSnapshot) {
			console.log('You sink ' + oldChildSnapshot.key);
		});
	}

});