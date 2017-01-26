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
				y: 1, // y must be less than or equal to number rows
				face: 'left'
			},
			2: {
				x: 4,
				y: 1,
				face: 'left'
			}
		},
		minPeople: 2,
		maxPeople: 5,
		people: {},
		timeInter: 0.36
	},

	init: function() {
		app.drawRoom(function() {
			app.addDoors();
		});
		//app.getPeople();
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

		//app.addPerson();
		// app.addPeople();
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

		// jQuery(this) = 

		// add door class
		// for(var j = 1; j <= app.vars.rows; j++) {
		// 	for(var = i; i <= app.vars.cols; i++) {

		// 	}
		// }

		for(var i = 1; i <= numOfDoors; i++) {
			var x = app.vars.doors[i].x,
				y = app.vars.doors[i].y,
				face = app.vars.doors[i].face;

			jQuery('.classroom-wrap li[data-row=' +x+ '][data-col=' +y+ ']').addClass('door '+ face);

			// jQuery('.classroom-wrap li[data-row=' +y+ '][data-col=' +x+ ']').addClass('here');
		}
		
	},

	addPeople: function(cbf) {
		// jQuery(".classroom-wrap li:nth-last-child(2), .classroom-wrap li:last-child").addClass('door');

		var minPeople = app.vars.minPeople;
		var maxPeople = app.vars.maxPeople;
		var currPeople = Math.floor(Math.random()* (maxPeople - minPeople + 1) + minPeople);
		jQuery('#number').text(currPeople + ' people');

		var people = "<span class='people-item'></span>",
			randomElements = jQuery("li").get().sort(function(){ 
			  return Math.round(Math.random())-0.5
			}).slice(0,currPeople);

		console.log(randomElements);

		jQuery(randomElements).addClass('people');
		jQuery('.people').append(people);

		if(typeof cbf == 'function') {
			app.getPeople(function() {
				cbf.call(this);
			});
		}

		// app.getPeople();

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

}