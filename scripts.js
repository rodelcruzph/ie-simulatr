var boxDim = 50;
var rows = 5;
var cols = 7;

( function() {
	
	jQuery(document).ready( function() {
		
		//divideArea();
		drawRoom();
		
		function divideArea(){
			
			var x = ( jQuery('#classroom').width() ) / boxDim;
			var y = ( jQuery('#classroom').height() ) / boxDim;
			var insertLi = x * y;

			for(var i =1; i<= insertLi; i++){

				jQuery('<li id="r'+i+'" class="tileBox" style="width:'+ boxDim +'px; height:'+ boxDim +'px;"></li>').appendTo('.classroom-wrap');
				
			}
			addPeople();
		}


		function addPeople() {
			jQuery(".classroom-wrap li:nth-last-child(2), .classroom-wrap li:last-child").addClass('door');

			var minPeople = 15;
			var maxPeople = rows * cols;
			var currPeople = Math.floor(Math.random()* (maxPeople - minPeople + 1) + minPeople);
			jQuery('#number').text(currPeople + ' people');

			var people = "<span class='people-item'></span>",
				randomElements = jQuery("li").get().sort(function(){ 
				  return Math.round(Math.random())-0.5
				}).slice(0,currPeople);

			jQuery(randomElements).addClass('people');
			jQuery('.people').append(people);
			
		}


		function drawRoom() {

			jQuery('#classroom').css({
				width: boxDim * cols,
				height: boxDim * rows
			});

			for(var j = 1; j <= rows; j++) {
				for(var i = 1; i <= cols; i++) {
					jQuery('<li data-row="'+j+'" data-col="'+i+'" class="tileBox" style="width:'+ boxDim +'px; height:'+ boxDim +'px;"></li>').appendTo('.classroom-wrap');
				}
			}

			addPeople();
		}

	});

	var app = {

	}
	
})();