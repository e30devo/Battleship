$(document).ready(function() {

/*-------------------------------------
| global var
-------------------------------------*/

var shipId;

var xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var yAxis = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

var playerGrid = xAxis.length * yAxis.length;

var database = firebase.database();

/*-------------------------------------
| print grid
-------------------------------------*/

for (var i = 0; i < playerGrid; i++) {
	var div = $("<div>");
	var img = $("<img>");
	var imgSrc = "./assets/images/waterTile.jpg";
	var optImg = "./assets/images/waterTile.jpg";
	img.addClass("water");
	img.attr("src", imgSrc);
	div.attr("index", [i]);
	div.addClass('block');
	div.attr('id','block'+[i]);

	div.append(img);
	$(".player").append(div);
}

/*-------------------------------------
| snap to grid
-------------------------------------*/

var snapGrid = $('<div class="snapGrid">');
$('.block').append(snapGrid);

$('.ship').draggable({
	grid: [ 52, 52 ],
	snap: '.snapGrid',
	snapMode: 'inner',
	containment: '.player'
});

/*-------------------------------------
| place/ confirm/ reset
-------------------------------------*/
// NOTE: need to relocate reset

$('#confirm').on('click', function(){

	database.ref('player1').remove();
	database.ref('player1-guess').remove();

	$('.block').removeClass('hasShip');
	$('.guess').detach();

	for(var i=1; i< 6; i++){
		shipId = 'ship'+i;

		for(var j = 0; j < playerGrid; j++){
			var blockId = 'block' + [j];
			overlap(blockId);
		}
	}
});

/*-------------------------------------
| check overlap
-------------------------------------*/

function overlap(blockId) {
	var x1 = $('#'+blockId).offset().left;
	var y1 = $('#'+blockId).offset().top;
	var h1 = $('#'+blockId).outerHeight(true);
	var w1 = $('#'+blockId).outerWidth(true);
	var b1 = y1 + h1;
	var r1 = x1 + w1;

	var x2 = $('#'+shipId).offset().left;
	var y2 = $('#'+shipId).offset().top;
	var h2 = $('#'+shipId).outerHeight(true);
	var w2 = $('#'+shipId).outerWidth(true);

	var b2 = y2 + h2;
	var r2 = x2 + w2;

	if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
		// $('#'+blockId).removeClass('occupied');
	} else {
		$('#'+blockId).addClass('occupied');

		/* push block location to database -------------------------------*/
		database.ref('player1').push(blockId);
	}
}

/*-------------------------------------
| duplicate board
-------------------------------------*/

var newGrid = $('.board').html();
$('.board').append(newGrid);
$('.player:eq(1)').addClass('opponent');
$('.opponent .water').css('opacity',.6);

/* change opponent block id -------------------------------*/
for(var i = 0; i < playerGrid; i++){
	var newId = 'op-block'+i
	$('.opponent .block:eq('+ i +')').attr('id', newId);
	$('.opponent .snapGrid').detach();
}

/*-------------------------------------
| inset screen
-------------------------------------*/

$('.screen .player .water').detach();
$('.screen .player .snapGrid').detach();

var opScreen = $('.screen').html();
$('.screen').append(opScreen);
$('.screen .player:eq(1)').addClass('opponent');

for (var i = 0; i < playerGrid; i++) {
	$('.screen .player .block:eq(' + [i] + ')').attr('id','screen' + [i] + '');
	$('.screen .opponent .block:eq(' + [i] + ')').attr('id','opScreen' + [i] + '');
}

/*-------------------------------------
| download opponent ship location
-------------------------------------*/

database.ref('player1').on('child_added', function(snapshot){
	var opBlockId = 'op-' + snapshot.val();

	$('#'+opBlockId).addClass('hasShip');
});

/*-------------------------------------
| click to rotate
-------------------------------------*/

$('.ship').on('click', function(){
	var rotate = $(this).attr('rotate');
	var size = $(this).attr('size');

	if (rotate === 'false') {
		$(this).attr('rotate', 'true');
		$(this).css('height',size).css('width','32px');
		$(this).find('img').attr('src','./assets/images/ship1-v.png');
	} else {
		$(this).attr('rotate', 'false');
		$(this).css('height','32px').css('width',size);
		$(this).find('img').attr('src','./assets/images/ship1.png');
	}
});

/*-------------------------------------
| hit and sink
-------------------------------------*/

var hitSrc = './assets/images/hit.png';
var missSrc = './assets/images/miss.png';

$(document).on('click', '.opponent .block',function(){

	var guessIndex = $(this).attr('index');
	var hasShip = $(this).hasClass('hasShip');

	if(hasShip){
		$('#opScreen'+guessIndex).append('<img class="guess" src="'+ hitSrc +'">');
	} else {
		$('#opScreen'+guessIndex).append('<img class="guess" src="'+ missSrc +'">');
	}

	database.ref('player1-guess').push(guessIndex);
	console.log(guessIndex);
});

database.ref('player1-guess').on('child_added', function(snapshot){
	var guessIndex = snapshot.val();
	var hasShip = $('#block' + guessIndex).hasClass('occupied');

	if(hasShip){
		$('#screen'+guessIndex).append('<img class="guess" src="'+ hitSrc +'">');
	} else {
		console.log('miss');
		$('#screen'+guessIndex).append('<img class="guess" src="'+ missSrc +'">');
	}
});


}); //document.ready close