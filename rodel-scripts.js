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
				x: 1, // x must less than or equal to number of cols
				y: 3, // y must be less than or equal to number rows
				face: 'top'
			},
			2: {
				x: 1,
				y: 4,
				face: 'top'
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

		/* Init sa magdamag */
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

		jQuery('#main-content').append(playBtn);

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
							'col': app.vars.doors[currDoor].x,
							'row': app.vars.doors[currDoor].y
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
						endY = app.vars.dtd[i].col,
						startX = app.vars.people[i].colCoords,
						endX = app.vars.dtd[i].row;

						app.move.getDirection(startY, endY, startX, endX, i);
				}

				// setInterval(function() {
				// 	var i = 1;
				// 	var startY = app.vars.people[i].rowCoords,
				// 		endY = app.vars.dtd[i].col,
				// 		startX = app.vars.people[i].colCoords,
				// 		endX = app.vars.dtd[i].row;

				// 		app.move.getDirection(startY, endY, startX, endX, i);
				// 		i++;
				// }, 316);
			});

		},

		getDirection: function(startRow, endRow, startCol, endCol, person, cfb) {
			var totalHorz = Math.abs(startCol - endCol),
				totalVert = Math.abs(startRow - endRow);

			console.log(startRow+":"+startCol+":"+endRow+":"+endCol);

			/* First Move */
			if (endRow == 1) {
				if(startCol == endCol) {
					console.log(person + ' will move up 1');
				} else if(startCol < endCol) {
					if(totalVert == 0) {
						console.log(person + ' will move right 2');
					} else {
						console.log(person + ' will move right 3');
					}
				} else {
					if(totalVert == 0) {
						console.log(person + ' will move left 4');
					} else {
						console.log(person + ' will move left 5');
					}
				}
			} else if (endRow == app.vars.rows) {
				if (startCol == endCol) {
					console.log(person + ' will move down 6');
				} else if(startCol < endCol) {
					if (totalVert == 0) {
						console.log(person + ' will move right 7');
					} else {
						console.log(person + ' will move right 8');
					}
				} else {
					if (totalVert == 0) {
						console.log(person + ' will move left 9');
					} else {
						console.log(person + ' will move left 10');
					}
				}
			} else if (endCol == 1) {
				if(startRow == endRow) {
					console.log(person + ' will move left 11');
				} else if(starRow < endRow) {
					if (totalHorz == 0) {
						console.log(person + ' will move down 12');
					} else {
						console.log(person + ' will move down 13');
					}
				} else {
					if (totalHorz == 0) {
						console.log(person + ' will move up 14');
					} else {
						console.log(person + ' will move up 15');
					}
				}
			} else if (endCol == app.vars.cols) {
				if(starRow < endRow) {
					if (totalHorz == 0) {
						console.log(person + ' will move right 16');
					} else {
						console.log(person + ' will move down 17');
					}
				} else {
					if (totalHorz == 0) {
						console.log(person + ' will move right 18');
					} else {
						console.log(person + ' will move up 19');
					}
				}
			}
		},

		getDirections: function(startRow, endRow, startCol, endCol, person, cfb) {

			var totalHorz = Math.abs(startCol - endCol),
				totalVert = Math.abs(startRow - endRow);

			console.log("movement: " + totalVert + " : " + totalHorz);

			// console.log("X direction: " + startCol + " : " + endCol);

			if(totalVert == 0 && totalHorz == 0) {

				console.log(person + ' is by the ext door');

			} else if (totalVert < totalHorz) {

				if(totalVert == 0) {

					if(startCol < endCol) {
						console.log(person + ' will move right a');
					} else {
						console.log(person + ' will move left b');
					}
						
				} else {

					if(startRow < endRow) {
						console.log(person + ' will move down c');
					} else {
						console.log(person + ' will move up d');
					}
				}

			} else if (totalHorz < totalVert) {

				if(totalHorz == 0) {

					if(startRow < endRow) {
						console.log(person + ' will move down g');
					} else {
						console.log(person + ' will move up h');
					}
						
				} else {

					if(startCol < endCol) {
						console.log(person + ' will move right e');
					} else {
						console.log(person + ' will move left f');
					}

				}

			}

				else if (totalHorz == totalVert) {

					if(startRow - 1 > endRow) {
						console.log(person + ' will move right i');
					} else {
						console.log(person + ' will move left j');
					}
						
				} else {

					if(startRow < endRow) {
						console.log(person + ' will move down k');
					} else {
						console.log(person + ' will move up l');
					}
				}


		},

		isFree: function() {

		}
	}

}