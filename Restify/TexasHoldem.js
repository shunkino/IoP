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

function index(req, res, next) {
	res.send({message: 'this is index'});
}

server.get('/', index);
//routing
//version 1.0.0
server.get({ path: '/API/Card/get/:player/:hands', version: '1.0.0' }, function(req, res, next) {
	//var for paramator
	var cardPlayerName = req.params.player;
	var cardPlayerHand = req.params.hands;
	//putting and converting card information.
	var cardObject = card.get(cardPlayerName, cardPlayerHand);
	var cardConverted = gameUtil.cardConverter(cardObject);
	if (cardObject != false) {
		//stringigy demo
		//console.log(JSON.stringify(cardConverted));	
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
	//call tray funtion and give other paramators as well.	
	console.log(req.params.player);
});

server.get({ path: '/API/Tray/:action', version: '1.0.0' }, function(req, res, next) {
	//restart or other action from tray
	var trayAction = req.params.action;
	if (trayAction == "restart") {
		game.initialize();
		res.contentType = 'text/plain';
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
