var PokerEvaluator = require("poker-evaluator");
var gameUtil = require('./Util');	

module.exports = {
	showDown: function(player1Hand, player2Hand, fieldHand) {
		console.log("show down!!!");
		var p1Full = player1Hand.concat(fieldHand);
		var p2Full = player2Hand.concat(fieldHand);
		var p1Poker = gameUtil.convertToPoker(p1Full);
		var p2Poker = gameUtil.convertToPoker(p2Full);
		console.log(p1Poker);
		console.log(p2Poker);
		//Evaluated objects
		var p1Eval = PokerEvaluator.evalHand(p1Poker);
		console.log(p1Eval);
		var p2Eval = PokerEvaluator.evalHand(p2Poker);
		console.log(p2Eval);
		if (p1Eval.value > p2Eval.value) {
			return "P1";
		} else {
			return "P2";
		}
	}	
}
