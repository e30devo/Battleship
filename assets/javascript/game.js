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

	img.addClass("water");
	img.attr("src", imgSrc);

	div.attr("index", [i]);
	div.addClass('block');
	div.append(img);

	$(".player").append(div);

	$('.board .player div').attr('id','block'+[i]);
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

var opGrid = $('.board').html();
$('.board').append(opGrid);
$('.player:eq(1)').addClass('opponent');
$('.opponent .water').css('opacity',.6);

/* change opponent block id -------------------------------*/
for(var i = 0; i < playerGrid; i++){
	var opId = 'op-block'+i
	$('.opponent .block:eq('+ i +')').attr('id', opId);
	$('.opponent .snapGrid').detach();
}

/*-------------------------------------
| download opponent ship location
-------------------------------------*/

database.ref('player1').on('child_added', function(snapshot){
	var opBlockId = 'op-' + snapshot.val();

	$('#'+opBlockId).addClass('hasShip');
});

/*-------------------------------------
| hit and sink
-------------------------------------*/

$(document).on('click', '.opponent .block',function(){
	var guessId = 'block' + $(this).attr('index');
	var hasShip = $(this).hasClass('hasShip');

	if(hasShip){
		var hitSrc = './assets/images/hit.png';
		$(this).find('.water').attr('src', hitSrc).css('opacity',1);
	} else {
		var missSrc = './assets/images/miss.png';
		$(this).find('.water').attr('src', missSrc).css('opacity',1);
	}

	database.ref('player1-guess').push(guessId);
	console.log(guessId);
});

database.ref('player1-guess').on('child_added', function(snapshot){
	var guessId = snapshot.val();
	var hasShip = $('#' + guessId).hasClass('occupied');

	if(hasShip){
		var hitImg = '<img class="guess" src="./assets/images/hit.png">';
		$('#' + guessId).prepend(hitImg);
	} else {
		var missImg = '<img class="guess" src="./assets/images/miss.png">';
		$('#' + guessId).prepend(missImg);
	}
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

}); //document.ready close