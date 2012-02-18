
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	stache = require('stache');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('view engine', 'mustache');
  app.register('.mustache', stache);
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/signedin', routes.signedin);
app.get('/alert/:username', routes.alert);
app.get('/register', routes.register);

app.post('/newuser', routes.adduser);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
