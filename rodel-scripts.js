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
		maxPeople: 2,
		people: {},
		timeInter: 0.36,
		dtd: {}
	},

	init: function() {
		app.drawRoom(function() {
			app.addDoors(app.move.getExitDoor());
		});
	},

	drawRoom: function(cbf) {
		jQuery('#classroom').css({
			width: app.vars.boxDim * app.vars.cols,
			height: app.vars.boxDim * app.vars.rows
		});

		for(var j = 1; j <= app.vars.rows; j++) {
			for(var i = 1; i <= app.vars.cols; i++) {
				jQuery('<li data-row="'+j+'" data-col="'+i+'" class="tileBox" style="width:'+ app.vars.boxDim +'px; height:'+ app.vars.boxDim +'px;"></li>').appendTo('.classroom-wrap');
			}
		}

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

		var people = "<span class='people-item'></span>",
			randomElements = jQuery("li").get().sort(function(){ 
			  return Math.round(Math.random())-0.5
			}).slice(0,currPeople);

		for(var i = 0; i < randomElements.length; i++) {
			jQuery(randomElements[i]).addClass('people').append("<span class='people-item'>" + (i+1) + "</span>");
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
				xRes = null,
				yRes = null,
				dtd = [[]];

			for(var j = 1; j <= numOfPeople; j++) {
				for(var i = 1; i <= numOfDoors; i++) {

					if(xRes == null && yRes == null) {
						xRes = Math.abs(app.vars.doors[i].x - app.vars.people[j].rowCoords);
						yRes = Math.abs(app.vars.doors[i].y - app.vars.people[j].colCoords);
						console.log('vals were null');
					} else {

					}
				}
			}

			console.log(xRes + " : " + yRes);

			// for(var dist in dtd) {
			// 	sortable.push([dist, dtd[dist]])
			// }

			// sortable.sort(function(a,b) {
			// 	return a[1] - b[1];
			// });

			


		},

		getDirection: function(y, x, cfb) {
			var currCol = y, currRow = x;



		},

		isFree: function() {

		}
	}

}