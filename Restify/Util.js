var suitNum;
var numNum;
var retStr;

var hash = function(key, value) {
	var hashObj = {};
	hashObj[key] = value;
	return hashObj;
}

module.exports = {
	cardConverter: function(cardObject, player, hand, phase, winner, looser) {
		if (winner == 0) {
			console.log("winner is yet set");
		//cardObject must be key-value array.
		//{suits: Number}
		//suits
		//0 : diamond
		//1 : heart
		//2 : spade
		//3 : club
		//4 : tablet->hidden card->message 
		switch (cardObject.suits) {
			case 'diamond':
				suitNum = 0;
			break;
			case 'heart':
				suitNum = 1;
			break;
			case 'spade':
				suitNum = 2;
			break;
			case 'club':
				suitNum = 3;
			default:
				break;	
		}
		switch (cardObject.numbers) {
			case 'A':
				numNum = 1;
			break;
			case 'J':
				numNum = 11;
			break;
			case 'Q':
				numNum = 12;
			break;
			case 'K':
				numNum = 13;
			break;
			default:
				numNum = parseInt(cardObject.numbers);
			break;
		}
		console.log(player + "phase" + phase);
		if (player == "P0") {
			if (phase < 2) {
				//when phase is 0 -> no bet yet
				var convertedCard = hash(4, numNum);
			} else if (phase < 4 && hand > 3) {
				var convertedCard = hash(4, numNum);	
			} else if (phase < 6 && hand == 5) {
				var convertedCard = hash(4, numNum);	
			} else {
				var convertedCard = hash(suitNum, numNum);
			}
		} else {
			var convertedCard = hash(suitNum, numNum);
		}
		return convertedCard;
		} else {
			console.log("winner is " + winner);
			if ((player == winner && hand == 1) || (player == "P0" && hand== 1)) {
				var message = {5:0};
			} else if ((player == winner && hand == 2) || (player == "P0" && hand== 2)) {
				var message = {5:1};
			} else if ((player == looser && hand == 1) || (player == "P0" && hand== 4)) {
				var message = {5:2};
			} else if ((player == looser && hand == 2) || (player == "P0" && hand== 1)) {
				var message = {5:3};
			}
			return message;
		}	
	},
	//make hash array function usable from other module.
	hash : function (key, value) {
		var tempObj = hash(key, value);
		return tempObj
	}
}
