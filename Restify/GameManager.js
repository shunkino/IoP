var nodeOfCards = require('node-of-cards');
var nodeCard = require('cards');
var card = require('./Card');
var deck = [];
var players = ["P1", "P2"];

var deckShuffle = function(callback) {
	nodeOfCards.shuffle(function (err, data) {
		callback();
	}); 
}
var deckDraw = function(target) {
	nodeOfCards.draw(function (err, drawData) {
		addHand(drawData, target);
	});
}
var addHand = function(handCard, target) {
	console.log("this is add hand function " + target);
	console.log(handCard);
	card.add(handCard, target);
}

module.exports = {
	//call from url scheme
	initialize: function() {
		deckShuffle(function() {
			//while(!card.isFull(players[0])) {
				deckDraw(players[0]);
			//}
		});
	},
	//test perpose
	drawCall: function() {
		nodeOfCards.draw(function (err, drawData) {
			console.log(drawData);
		});	
	}
};
