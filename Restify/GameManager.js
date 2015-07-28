var nodeOfCards = require('node-of-cards');
var deck = [];

var deckDraw = function() {
	nodeOfCards.draw(function (err, drawData) {
		console.log(drawData);
	});
}
var deckShuffle = function(next) {
	nodeOfCards.shuffle(function (err, data) {
		console.log(data);
		next();
	}); 
}

module.exports = {
	//call from url scheme
	initialize: function() {
		deckShuffle(function() {
			deckDraw();
		});
	},
	drawCall: function() {
		nodeOfCards.draw(function (err, drawData) {
		   	console.log(drawData);
		});	
	}
};
