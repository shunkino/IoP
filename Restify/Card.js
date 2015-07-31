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
	get: function(playerName, handName) {
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
