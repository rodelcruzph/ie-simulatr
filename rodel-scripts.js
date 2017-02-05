( function($) {
	
	jQuery(document).ready( function() {
		
		app.init();

	});
	
})();

var app = {
	vars: {
		boxDim: 50,
		rows: 6,
		cols: 6,
		doors: {
			1: {
				x: 3, // x must less than or equal to number of cols
				y: 6, // y must be less than or equal to number rows
				face: 'right'
			},
			2: {
				x: 4,
				y: 6,
				face: 'right'
			}
		},
		minPeople: 1,
		maxPeople: 5,
		people: {},
		timeInter: 0.36,
		dtd: {}
	},

	init: function() {
		app.drawRoom(function() {
			app.addDoors(app.move.getExitDoor());
		});

		app.move.movePerson();
	},

	drawRoom: function(cbf) {
		jQuery('#classroom').css({
			width: app.vars.boxDim * app.vars.cols,
			height: app.vars.boxDim * app.vars.rows
		});

		for(var j = 1; j <= app.vars.rows; j++) {
			for(var i = 1; i <= app.vars.cols; i++) {
				jQuery('<li data-row="'+j+'" data-col="'+i+'" class="tileBox" style="width:'+ app.vars.boxDim +'px; height:'+ app.vars.boxDim +'px;"><span class="item"></span></li>').appendTo('.classroom-wrap');
			}
		}

		// Add play/start button
		playBtn = '<div class="play-btn-holder"> \
					<a href="javascript:;" class="play-btn">Start</a> \
					</div>';

		jQuery('body').append(playBtn);

		if(typeof cbf == 'function') {
			app.addPeople(function() {
				cbf.call(this);
			});
		}
	},

	addPerson: function() {
		var people = "<span class='people-item'></span>",
			rowCoor = 3,
			colCoor = 6;

		jQuery('.classroom-wrap li').each(function() {
			if(jQuery(this).data('row') == rowCoor && jQuery(this).data('col') == colCoor) {
				jQuery(this).addClass('people');
			}
		});

		jQuery('.people').append(people);

		app.getPeople();
	},

	addDoors: function(cbf) {

		var numOfDoors = Object.keys(app.vars.doors).length;

		for(var i = 1; i <= numOfDoors; i++) {
			var x = app.vars.doors[i].x,
				y = app.vars.doors[i].y,
				face = app.vars.doors[i].face;

			jQuery('.classroom-wrap li[data-row=' +x+ '][data-col=' +y+ ']').addClass('door '+ face);
		}

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
		
	},

	addPeople: function(cbf) {

		var minPeople = app.vars.minPeople;
		var maxPeople = app.vars.maxPeople;
		var currPeople = Math.floor(Math.random()* (maxPeople - minPeople + 1) + minPeople);
		jQuery('#number').text(currPeople + ' people');

		var randomElements = jQuery("li").get().sort(function(){ 
			  return Math.round(Math.random())-0.5
			}).slice(0,currPeople);

		// people = "<span class='people-item'></span>",

		for(var i = 0; i < randomElements.length; i++) {
			// jQuery(randomElements[i]).addClass('people').append("<span class='item'>" + (i+1) + "</span>");
			jQuery(randomElements[i]).addClass('people').find('span.item').html(i+1);
		}

		if(typeof cbf == 'function') {
			app.getPeople(function() {
				cbf.call(this);
			});
		}

	},

	getPeople: function(cbf) {
		var i = 1;

		jQuery('.classroom-wrap li').each(function() {
			if(jQuery(this).hasClass('people')) {
				app.vars.people[i] = {
					'colCoords': jQuery(this).data('col'),
					'rowCoords': jQuery(this).data('row')
				}
				i += 1;
			}
		});

		if(typeof cbf == 'function') {
			cbf.call(this);
		}
	},

	move: {
		getExitDoor: function() {
			var numOfDoors = Object.keys(app.vars.doors).length,
				numOfPeople = Object.keys(app.vars.people).length,
				xRes = 0,
				yRes = 0,
				total = null,
				currTotal = null,
				currDoor = 1;

			for(var j = 1; j <= numOfPeople; j++) {
				for(var i = 1; i <= numOfDoors; i++) {

					xRes = Math.abs(app.vars.doors[i].x - app.vars.people[j].rowCoords);
					yRes = Math.abs(app.vars.doors[i].y - app.vars.people[j].colCoords);

					currTotal = xRes + yRes;

					if(total == null || currTotal < total) {

						// Compare distance to each door then assign exit door
						app.vars.dtd[j] = {
							'x': app.vars.doors[currDoor].x,
							'y': app.vars.doors[currDoor].y
						}

						total = currTotal;

					}

					currDoor += 1;
				} // numOfDoors
				currDoor = 1;
				total = null;
			} // numOfPeople

		},

		movePerson: function() {
			var x, y, numOfPeople = Object.keys(app.vars.people).length;

			jQuery('.play-btn').on('click', function() {

				for(var i = 1; i <= numOfPeople; i++) {
					var startY = app.vars.people[i].rowCoords,
						endY = app.vars.dtd[i].x,
						startX = app.vars.people[i].colCoords,
						endX = app.vars.dtd[i].y;

						app.move.getDirection(startY, endY, startX, endX, i);
				}

			});

		},

		getDirection: function(startY, endY, startX, endX, person, cfb) {

			var totalHorz = Math.abs(startX - endX),
				totalVert = Math.abs(startY - endY);

			console.log(totalHorz + " : " + totalVert);

			if(totalVert == 0 && totalHorz == 0) {
				console.log(person + 'is by the ext door');
			} else if((totalVert == 0 && totalHorz > 0) || (totalVert > totalHorz)) {
				console.log(person + ' will move left or right');
			} else if((totalHorz == 0 && totalVert > 0) || (totalHorz || totalVert)) {
				console.log(person + ' will move down or up');
			}


		},

		isFree: function() {

		}
	}

}