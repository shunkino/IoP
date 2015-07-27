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
server.get({ path: '/api/card/:player/:hands', version: '1.0.0' }, function(req, res, next) {
	//version 1.0.0
	if (req.params.player == "p1") {
		//player1
		//console.log(req.params.hands);
		card.show(req.params.player);
		//call card function from here. use :hands for detecting which card to render.
	} else if (req.params.player == "p2"){
		//player2
		tray.drop();
	}
});

server.get({ path: '/api/tray/:player', version: '1.0.0' }, function(req, res, next) {
	//call tray funtion and give other paramators as well.	
});

server.get({ path: '/api/game/:action', version: '1.0.0' }, function(req, res, next) {
	//call game manager.
});

//preporcessing for versioning
server.pre(function (req, res, next) {
	var pieces = req.url.replace(/^\/+/, '').split('/');
	//console.log(pieces);
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
	return next();
});
//server.get('/:name', function(req, res, next) {
//	return next(new restify.NotFoundError("I hate you"));
//});

//サーバーがどこで待つかの記述
server.listen((8080), function() {
	console.log('%s listening at %s', server.name, server.url);
});
