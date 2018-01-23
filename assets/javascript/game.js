$(document).ready(function() {

var shipId;

var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var yAxis = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

var playerGrid = xAxis.length * yAxis.length;

var database = firebase.database();

$('.screen img').detach();

var opShip =[];

var myGame = $('.hideLogout').attr('data-game');
var myRole = $('.hideLogout').attr('data-player');
var myOpponent;
var myPath;
var opPath;

if(myRole === 'playerOne'){
	myOpponent = 'playerTwo';
	myPath = myGame + '/playerOne';
	opPath = myGame + '/playerTwo';
} else {
	myOpponent = 'playerOne';
	myPath = myGame + '/playerTwo';
	opPath = myGame + '/playerOne';
}

reset_game();
function reset_game(){
	$('.guess').detach();
	$('.screen.player').hide();
	$('.screen.opponent').show();

	database.ref(myGame +'/' + myRole + '/guess').remove();
	database.ref(myGame +'/' + myRole + '/ship').remove();
}

/*-------------------------------------
| print grid
-------------------------------------*/

for (var i = 0; i < xAxis.length; i++) {
	for (var j = 0; j < yAxis.length; j++) {
		var playerBlock = $('<div class="block">');
		var opponentBlock = $('<div class="block">');

		var playerGrid = $('<div class="block">');

		var water = $('<img src="./assets/images/waterTile.jpg">');

		playerBlock.attr('id', xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);
		playerGrid.attr('id', 'screen'+ xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);
		opponentBlock.attr('id', 'op'+xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);

		$('.board .player').append(playerBlock);
		$('.board .opponent').append(opponentBlock);
		$('.screen.player').append(playerGrid);
	}
}

$('.board .block').append(water);

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
		$(this).find('img').attr('src','./assets/images/ship1-v.png');
	} else {
		$(this).attr('rotate', 'false');
		$(this).css('height','26px').css('width',size);
		$(this).find('img').attr('src','./assets/images/ship1.png');
	}
});

/*-------------------------------------
| place/ confirm/ reset
-------------------------------------*/

$('#start').on('click', function(){

	myGame = $('#signOut').attr('data-game');
	myRole = $('#signOut').attr('data-player');

	if(myRole === 'playerOne'){
		myOpponent = 'playerTwo';
	} else {
		myOpponent = 'playerOne';
	}

	console.log(myRole, myGame, myOpponent);

	$('.screen.opponent').hide();
	$('.screen.player').show();

	for(var i=1; i< 6; i++){
		shipId = 'ship'+i;

		for (var j = 0; j < xAxis.length; j++) {
			for (var k = 0; k < yAxis.length; k++) {
				var blockId = xAxis[j] + yAxis[k];
				overlap(shipId, blockId);
			}
		}
	}

	database.ref( myGame +'/'+ myOpponent + '/ship/ship1').on('child_added', function(snapshot){
		var blockIndex = snapshot.key;
		opShip.push(blockIndex);
		console.log(blockIndex)
	});

	database.ref( myGame +'/'+ myOpponent + '/ship/ship2').on('child_added', function(snapshot){
		var blockIndex = snapshot.key;
		opShip.push(blockIndex);
		console.log(blockIndex)
	});

	database.ref( myGame +'/'+ myOpponent + '/ship/ship3').on('child_added', function(snapshot){
		var blockIndex = snapshot.key;
		opShip.push(blockIndex);
		console.log(blockIndex)
	});

	database.ref( myGame +'/'+ myOpponent + '/ship/ship4').on('child_added', function(snapshot){
		var blockIndex = snapshot.key;
		opShip.push(blockIndex);
		console.log(blockIndex)
	});

	database.ref( myGame +'/'+ myOpponent + '/ship/ship5').on('child_added', function(snapshot){
		var blockIndex = snapshot.key;
		opShip.push(blockIndex);
		console.log(blockIndex)
	});
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

		/* push block location to database -------------------------------*/
		database.ref(myGame + '/' + myRole + '/ship/' + shipId + '/'+ blockId).set({
			blockId: blockId
		});
	}
}

// database.ref(myGame + '/' + myOpponent +'/ship/ship1').on('child_added', function(snapshot){
// 	var blockIndex = snapshot.key;
// 	opShip.push(blockIndex);
// 	console.log(blockIndex);
// });
//
// database.ref(myGame + '/' + myOpponent +'/ship/ship2').on('child_added', function(snapshot){
// 	var blockIndex = snapshot.key;
// 	opShip.push(blockIndex);
// 	console.log(blockIndex);
// });
//
// database.ref(myGame + '/' + myOpponent +'/ship/ship3').on('child_added', function(snapshot){
// 	var blockIndex = snapshot.key;
// 	opShip.push(blockIndex);
// 	console.log(blockIndex);
// });
//
// database.ref(myGame + '/' + myOpponent +'/ship/ship4').on('child_added', function(snapshot){
// 	var blockIndex = snapshot.key;
// 	opShip.push(blockIndex);
// 	console.log(blockIndex);
// });



/*-------------------------------------
| hit or miss
-------------------------------------*/

var enemies = ['ship1', 'ship2', 'ship3', 'ship4', 'ship5'];

$(document).on('click', '.opponent .block',function(){
	var blockIndex = $(this).attr('index');

	var hitSrc = './assets/images/hit.png';
	var missSrc = './assets/images/miss.png';

	var hit = opShip.indexOf(blockIndex);
	console.log(hit);
	console.log(opShip);

	myGame = $('#signOut').attr('data-game');
	myRole = $('#signOut').attr('data-player');

	if(myRole === 'playerOne'){
		myOpponent = 'playerTwo';
	} else {
		myOpponent = 'playerOne';
	}

/* miss -------------------------------*/
	if(hit === -1){
		$('#op'+blockIndex).find('img').attr('src', missSrc);

		database.ref(myGame + '/' + myRole + '/guess/' + blockIndex).set({
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

		database.ref(myGame + '/' + myRole + '/guess/' + blockIndex).set({
			status: whichShip
		});

		database.ref(myGame + '/' + myOpponent + '/ship/' + whichShip + '/' + blockIndex).remove();
	}

	database.ref(myGame + '/' + myOpponent + '/ship' ).on('child_removed', function(oldChildSnapshot) {
	  console.log('You sink ' + oldChildSnapshot.key);
	});

});

/*-------------------------------------
| opponent's hit
-------------------------------------*/

database.ref(myGame + '/' + myOpponent + '/guess' ).on('child_added', function(snapshot){
	var blockIndex = snapshot.key;
	var status = snapshot.val().status;

	var hitSrc = './assets/images/hit.png';
	var missSrc = './assets/images/miss.png';

	if(status ==='miss'){
		$('#screen'+blockIndex).append('<img src="' + missSrc + '">');
	} else {
		$('#screen'+blockIndex).append('<img src="' + hitSrc + '">');
	}
});

/*-------------------------------------
| sink and defeat
-------------------------------------*/




}); //document.ready close
