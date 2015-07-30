var nodeOfCards = require('node-of-cards');
var nodeCard = require('cards');
var card = require('./Card');
var deck = [];
var players = ["P1", "P2"];
//variable to keep 52 card deck
var cardDeck;
var newCard;

var deckShuffle = function(callback) {
	cardDeck = new nodeCard.PokerDeck();
	cardDeck.shuffleAll();
	callback();
	//nodeOfCards.shuffle(function (err, data) {
	//	callback();
	//}); 
}
var deckDraw = function(target) {
	newCard = cardDeck.draw();
	//console.log(newCard.suit + ":" + newCard.value);
	cardVal = newCard.suit + ":" + newCard.value;
	addHand(cardVal, target);
	//nodeOfCards.draw(function (err, drawData) {
	//	addHand(drawData, target);
	//});
}
var addHand = function(handCard, target) {
	console.log("this is add hand function " + target);
	//console.log(handCard);
	card.add(handCard, target);
}

module.exports = {
	//call from url scheme
	initialize: function() {
		deckShuffle(function() {
			for(i = 0; i < 2; i++) {
				console.log("show i " + i);
				console.log("show isFull " + !card.isFull(players[1]));
				while(!card.isFull(players[i])) {
					deckDraw(players[i]);
				}
			}
		});
	},
	//test perpose
	drawCall: function() {
		nodeOfCards.draw(function (err, drawData) {
			console.log(drawData);
		});	
	}
};
