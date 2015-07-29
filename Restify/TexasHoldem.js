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

function index(req, res, next) {
	res.send({message: 'this is index'});
}

server.get('/', index);
//routing
//version 1.0.0
server.get({ path: '/API/Card/:player/:hands', version: '1.0.0' }, function(req, res, next) {
	var cardPlayer = req.params.player;
		card.show(cardPlayer);
});

server.get({ path: '/API/Tray/:action/:player', version: '1.0.0' }, function(req, res, next) {
	//call tray funtion and give other paramators as well.	
	console.log(req.params.player);
});

server.get({ path: '/API/Tray/:action', version: '1.0.0' }, function(req, res, next) {
	//restart or other action from tray
});
server.get({ path: '/API/Game/:action', version: '1.0.0' }, function(req, res, next) {
	//call game manager.
	var gameAction = req.params.action;
	if (gameAction == "start") {
		game.initialize();
	}
});

//preporcessing for versioning
server.pre(function (req, res, next) {
	var pieces = req.url.replace(/^\/+/, '').split('/');
	if(req.url.match(/v(\d{1})\.(\d{1})/)) {
		//do nothing when version is invalid.
		var version = pieces[1];
		//precise version number for passing to req.headers
		var preciseVersion;
		//change way to show version 
		if(!semver.valid(version)) {
			preciseVersion = version.replace(/v(\d{1})\.(\d{1})/, '$1.$2.0');	
		} if(semver.valid(preciseVersion) && server.versions.indexOf(preciseVersion) > -1) { req.url = req.url.replace(version + '/', ''); console.log(version);	
		console.log(req.url);
		req.headers['accept-version'] = preciseVersion;
		}
	}
	return next();
});
//server.get('/:name', function(req, res, next) {
//	return next(new restify.NotFoundError("I hate you"));
//});

//サーバーがどこで待つかの記述
server.listen((3000), function() {
	console.log('%s listening at %s', server.name, server.url);
});
