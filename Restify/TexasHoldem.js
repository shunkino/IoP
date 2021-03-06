var restify = require('restify');
var semver = require('semver');
var server = restify.createServer({
	name: 'IoP',
	//versioning
	versions: ['1.0.0']
});

//load modules for functions.
var game = require('./GameManager');
var tray = require('./Tray');
var card = require('./Card');
var gameUtil = require('./Util');

game.initialize();
server.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

function index(req, res, next) {
	res.send({message: 'this is index'});
}

server.get('/', index);
//routing
//version 1.0.0
server.get({ path: '/API/Card/get/:player/:hands', version: '1.0.0' }, function(req, res, next) {
	//variable for paramator
	var cardPlayerName = req.params.player;
	var cardPlayerHand = req.params.hands;
	//putting and converting card information.
	var cardObject = card.get(cardPlayerName, cardPlayerHand, game.getCurrentPhase(), game.getWinner());
	console.log(cardObject);
	var cardConverted = gameUtil.cardConverter(cardObject, cardPlayerName, cardPlayerHand, game.getCurrentPhase(), game.getWinner(), game.getLooser());
	if (cardObject != false) {
		console.log(cardConverted);
		res.send(cardConverted);
	} else {
		res.send("please first start game");
	}
});

//Redirection
server.get({ path: '/API/Card/:player/:hands', version: '1.0.0' }, function(req, res, next) { 
	res.send({"1":3});
	//	res.header('Location', '/API/Card/get/' + cardPlayerName + '/' + cardPlayerName);
	//	res.send();	
});

server.get({ path: '/API/Tray/:action/:player', version: '1.0.0' }, function(req, res, next) {
	var playerName = req.params.player;
	if (req.params.action == "bet") {
	tray.bet(playerName);
	} else {
		game.initialize();
	}
	res.send("OK");
});

server.get({ path: '/API/Tray/:action', version: '1.0.0' }, function(req, res, next) {
	//restart or other action from tray
	var trayAction = req.params.action;
	if (trayAction == "restart") {
		tray.restart();
		res.send("restarted");	
	}
});
server.get({ path: '/API/Game/:action', version: '1.0.0' }, function(req, res, next) {
	//call game manager.
	var gameAction = req.params.action;
	if (gameAction == "start") {
		game.initialize();
		res.send("OK");
	}
});

//preporcessing for versioning
server.pre(function (req, res, next) {
	var pieces = req.url.replace(/^\/+/, '').split('/');
	if (req.url.match(/v(\d{1})\.(\d{1})/)) {
		//do nothing when version is invalid.
		var version = pieces[1];
		//precise version number for passing to req.headers
		var preciseVersion;
		//change way to show version 
		if (!semver.valid(version)) {
			preciseVersion = version.replace(/v(\d{1})\.(\d{1})/, '$1.$2.0');	
		} if (semver.valid(preciseVersion) && server.versions.indexOf(preciseVersion) > -1) { req.url = req.url.replace(version + '/', '');
		console.log(version);	
		console.log(req.url);
		req.headers['accept-version'] = preciseVersion;
		}
	}
	return next();
});

//サーバーがどこで待つかの記述
server.listen((3000), function() {
	console.log('%s listening at %s', server.name, server.url);
});
