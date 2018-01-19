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
	// img.attr("data", [i]);
	img.attr("option", );
	div.addClass('block');
	div.attr('id','block'+[i]);

	div.append(img);
	$(".player").append(div);
}

$(".waterTile").on("click", function() {
	var src = $(this).attr("src");
	var optImg = $(this).attr("optImg");
	$(this).attr("data", optImg.replace(optImg, src));
	$(this).attr("src", src.replace(src, optImg));

})

/*-------------------------------------
| place and confirm
-------------------------------------*/

$('.ship').draggable({ grid: [ 52, 52 ], snap: ".snap" });

$('#confirm').on('click', function(){
	database.ref('location').remove();
	$('.block').removeClass('hasShip');

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
		database.ref('location').push(blockId);
	}
}

/*-------------------------------------
| duplicate board
-------------------------------------*/

var newGrid = $('.board').html();
$('.board').append(newGrid);
$('.grid:eq(1)').addClass('opponent');
$('.opponent .water').css('opacity',.6);

/* change opponent block id -------------------------------*/
for(var i = 0; i < playerGrid; i++){
	var newId = 'op-block'+i
	$('.opponent .block:eq('+ i +')').attr('id', newId);
}

/*-------------------------------------
| download opponent ship location
-------------------------------------*/

database.ref('location').on('child_added', function(snapshot){
	var opBlockId = 'op-' + snapshot.val();

	$('#'+opBlockId).addClass('hasShip');
});

/*-------------------------------------
| hit and sink
-------------------------------------*/

$(document).on('click', '.opponent .block',function(){
	var hasShip = $(this).hasClass('hasShip');

	if(hasShip){
		var hitSrc = 'assets/images/hit.png';
		$(this).find('.water').attr('src', hitSrc).css('opacity',1);
		console.log('hit');
	} else {
		var missSrc = 'assets/images/miss.png';
		$(this).find('.water').attr('src', missSrc).css('opacity',1);
		console.log('miss');
	}
});

}); //document.ready close