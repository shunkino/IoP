var gameManager = require('./GameManager');
module.exports = {
	bet: function(player) {
	//betting function
		gameManager.nextPhase(player);
	},
	drop: function() {
		console.log("you lose");
	},
	restart: function() {
		//for starting and restarting
		gameManager.initialize();
	}
};
