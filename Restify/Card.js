//arrays for player cards. 
var p1 = [];
var p2 = [];
module.exports = {
	show: function(playerName) {
		//show card
		if (p1.length > 0 && p2.length > 0) {
			//if card really exist.
			console.log("your name is " + playerName);
		}
	}
};
