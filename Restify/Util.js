var suitNum;
var numNum;
var retStr;

var hash = function(key, value) {
	var hashObj = {};
	hashObj[key] = value;
	return hashObj;
}

module.exports = {
	cardConverter: function(cardObject) {
		//cardObject must be key-value array.
		//{suits: Number}
		//suits
		//0 : diamond
		//1 : heart
		//2 : spade
		//3 : club
		//4 : hiden
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
		var convertedCard = hash(suitNum, numNum);
		return convertedCard;
	},
	//make hash array function usable from other module.
	hash : function (key, value) {
		var tempObj = hash(key, value);
		return tempObj
	}
}
