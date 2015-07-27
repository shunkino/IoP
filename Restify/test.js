var restify = require('restify');
var server = restify.createServer({
	name: 'IoP',
	//versioning
	versions: ['1.0.0']
});

function index(req, res, next) {
	res.send({message: 'this is index'});
}

server.get('/', index);
server.pre(function (req, res, next) {
	var pieces = req.url.replace(/^\/+/, '').split('/');
	//console.log(pieces);
	var version = pieces[1];
	//change way to show version 
	if(!semver.valid(version)) {
		version = version.replace(/v(\d{1})\.(\d{1})/, '$1.$2.0');	
		console.log(version);
	}

});
//server.get('/:name', function(req, res, next) {
//	return next(new restify.NotFoundError("I hate you"));
//});

//サーバーがどこで待つかの記述
server.listen((8080), function() {
	console.log('%s listening at %s', server.name, server.url);
});
