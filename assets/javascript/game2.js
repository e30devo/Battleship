$(document).ready(function() {

/*-------------------------------------
| global var
-------------------------------------*/

var shipId;

var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var yAxis = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

var playerGrid = xAxis.length * yAxis.length;

var database = firebase.database();

var opShip = [];

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
		playerGrid.attr('id', 'sceen'+ xAxis[i]+ yAxis[j]).attr('index', xAxis[i]+yAxis[j]);
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

	database.ref('player1').remove();
	database.ref('player1-guess').remove();

	$('.block').removeClass('hasShip');

	for(var i=1; i< 6; i++){
		shipId = 'ship'+i;

		for (var j = 0; j < xAxis.length; j++) {
			for (var k = 0; k < yAxis.length; k++) {
				var blockId = xAxis[j] + yAxis[k];
				overlap(shipId, blockId);
			}
		}
	}
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
		database.ref('player1/' + shipId + '/'+ blockId).set({
			blockId: blockId
		});

		opShip.push(blockId);
	}
}

/*-------------------------------------
| hit or miss
-------------------------------------*/

$(document).on('click', '.opponent .block',function(){
	var blockIndex = $(this).attr('index');

	var hitSrc = './assets/images/hit.png';
	var missSrc = './assets/images/miss.png';

	var hit = opShip.indexOf(blockIndex);
	console.log(hit);

/* miss -------------------------------*/
	if(hit === -1){
		$('#op'+blockIndex).find('img').attr('src', missSrc);

		database.ref('player1-guess/'+ blockIndex).set({
			status: 'miss'
		});
	}

/* hit -------------------------------*/
	else {
		$('#op'+blockIndex).find('img').attr('src', hitSrc);

		var whichShip;

		if(-1 < hit && hit < 2){ /* 0,1---------*/
			console.log(hit);
			whichShip = 'ship1';
		} else if (1 < hit && hit < 5){ /* 2,3,4---------*/
			whichShip = 'ship2';
		} else if (4 < hit && hit < 8){ /* 5,6,7---------*/
			whichShip = 'ship3';
		} else if (7 < hit && hit < 12){ /* 8,9,10,11---------*/
			whichShip = 'ship4';
		} else { /* 12,13,14,15,16---------*/
			whichShip ='ship5';
		}

		database.ref('player1-guess/'+ blockIndex).set({
			status: whichShip
		});

		database.ref('player1/'+ whichShip + '/' + blockIndex).remove();

		console.log(whichShip);
	}
});

/*-------------------------------------
| title
-------------------------------------*/

var opShipStatus = [true, true, true, true, true];

database.ref().on('child_removed', function(snapshot){
	// for(var i=1; i<6; i++){
	// 	var exist = snapshot.child('ship'+i).exists();
	// 	console.log(i, exist);
  //
	// 	if(!exist && opShipStatus[i] == true){
	// 		opShipStatus[i] = false;
	// 		console.log('ship' + i + 'sunk');
	// 	}
  //
	// }
});

}); //document.ready close
