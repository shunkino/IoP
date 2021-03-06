var nodeCard = require('cards');
var PokerEvaluator = require("poker-evaluator");
var card = require('./Card');
var poker = require('./Poker');
var deck = [];
var players = ["P1", "P2", "P0"];
//variable to keep 52 card deck
var cardDeck;
var newCard;
//variable to manage phase
var currentPhase;
var winner = 0;
var looser = 0;

var setWinner = function(player) {
	if (player == "P1") {
		looser = "P2";
	} else {
		looser = "P1";
	}
	winner = player;	

}
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
		currentPhase = 0;	
		winner = 0;
		looser = 0;
		card.clearAll();
		deckShuffle(function() {
			//draw all the cards which aprears in this round.
			for(var i = 0; i < 3; i++) {
				while(!card.isFull(players[i])) {
					deckDraw(players[i]);
				}
			}
		});
	},
	nextPhase: function(player) {
		if ((currentPhase < 8) &&
			((player == "P1" && currentPhase % 2 == 0)||
			 (player == "P2" && currentPhase % 2 == 1))){
			currentPhase++;
		}
		console.log("currentPhase is " + currentPhase);		
		if(currentPhase == 8) {
			winner = poker.showDown(card.getHand("P1"), card.getHand("P2"), card.getHand("P0"));
			setWinner(winner);
			console.log("winner is " + winner + "looser is " + looser);
		}
	},
	getCurrentPhase: function() {
		return currentPhase;
	},
	getWinner: function() {
		return winner;
	},
	getLooser: function() {
		return looser;
	},
}
