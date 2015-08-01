var gameManager = require('./GameManager');
//arrays for player cards. 
var p1 = [];
var p2 = [];
//field
var p0 = [];
module.exports = {
	clearAll: function() {
		p1 = [];
		p2 = [];
		p0 = [];
	},
	get: function(playerName, handName, phase) {
		//response card infomation
		if (p1.length > 0 && p2.length > 0 && p0.length > 0) {
			//check if all card really exist.
			switch (playerName) {
				case 'P1':
					return p1[handName - 1];
				break;
				case 'P2':
					return p2[handName - 1];
				break;
				case 'P0':
					//ここでphaseを確認してp0[handName - 1][0]に入ってるスーツを示す数字を変化させる。
			//	if (phase == 0) {
			//		hiddenCard = p0;
			//		console.log(hiddenCard);
			//		for (var i = 0, len = p0.length; i < len; i++) {
			//			hiddenCard[handName -1][0] = 4;
			//		}
			//		console.log(hiddenCard);	
			//		return hiddenCard[handName - 1]	
			//	}	
					return p0[handName - 1];
				break;				
				default:
					break;
			}	
		} else {
			return false;
			console.log("player don't have enough cards. please start game.");
		}
	},
	add: function(card, player) {
		switch (player) {
			case 'P1':
				p1.push(card);
			break;
			case 'P2':
				p2.push(card);
			break;
			case 'P0':
				p0.push(card);
			default:
				break;				
		}
	},
	isFull: function(player) {
		if (player == "P1") {
			if(p1.length < 2) {
				return false;	
			} else {
				return true;
			}
		} else if (player == "P2") {
			if(p2.length < 2) {
				return false;	
			} else {
				return true;
			}
		} else if (player == "P0") {
			if(p0.length < 5) {
				return false;	
			} else {
				return true;
			}
		}
	}
};
