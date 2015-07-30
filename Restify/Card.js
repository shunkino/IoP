//arrays for player cards. 
var p1 = [];
var p2 = [];
module.exports = {
	show: function(playerName) {
		//show card
		console.log("your name is " + playerName);
		if (p1.length > 0 && p2.length > 0) {
			//check if all card really exist.
			console.log(p1);
		} else {
			console.log("player don't have enough cards");
		}
	},
	add: function(card, player) {
		if (player == "P1" && p1.length < 2) {
			p1.push(card);	
		}  
		if (player == "P2" && p2.length < 2) {
			p2.push(card);
		}
	},
	isFull: function(player) {
		console.log("isFull message " + p2.length);
		if (player = "P1") {
		   if(p1.length < 2) {
			return false;	
		   } else {
		   	return true;
		   }
		} if (player = "P2") {
		   if(p2.length < 2) {
			return false;	
		   } else {
		   	return true;
		   }
		}
	}
};
