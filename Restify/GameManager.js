var nodeCard = require('cards');
var card = require('./Card');
var deck = [];
var players = ["P1", "P2", "P0"];
//variable to keep 52 card deck
var cardDeck;
var newCard;

var deckShuffle = function(callback) {
	cardDeck = new nodeCard.PokerDeck();
	cardDeck.shuffleAll();
	callback();
}
var deckDraw = function(target) {
	newCard = cardDeck.draw();
	cardVal = {"suits": newCard.suit, "numbers": newCard.value};
	addHand(cardVal, target);
}
var addHand = function(handCard, target) {
	//this function will be called to add card to hands.
	card.add(handCard, target);
}

module.exports = {
	//call from url scheme
	initialize: function() {
		card.clearAll();
		deckShuffle(function() {
			//draw all the cards which aprears in this round.
			for(var i = 0; i < 3; i++) {
				while(!card.isFull(players[i])) {
					deckDraw(players[i]);
				}
			}
		});
	}
};
