/**
 * Test code for restify library
 * install restify with
 * sudo npm install restify
 *
 * If you get an error on node-waf
 * install node 0.7.1 then go back to 0.6.x version
 *
 * You have to install winston too via
 * sudo npm install winston
 */

var restify = require('restify'),
    //Winston is for logging
    winston = require('winston'),
    //Create the server
    server = restify.createServer({
      name: 'Tldr'
    }),
    config = {
    "levels" : {
      "detail": 0,
      "trace": 1,
      "debug": 2,
      "enter": 3,
      "info": 4,
      "warn": 5,
      "error": 6
    },
    "colors" : {
      "detail": "grey",
      "trace": "white",
      "debug": "blue",
      "enter": "inverse",
      "info": "green",
      "warn": "yellow",
      "error": "red"
    } };

//Create custom logger with colors
var logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({
                    colorize:true}), ],
  levels: config.levels,
  colors: config.colors,
});
winston.addColors(config.colors);


//Defining common handlers to run before the routes
//It's important to define them before defining the routes

server.use(function commonHandlers (req, res, next) {
  logger.info('commonHandlers called');
  return next();
});


/*
 * Routing and callbacks
 */

//Response function
function respond (req, res, next) {
  res.send('hello '  +  req.params.name);
}

function send (req, res, next) {
  res.send('send hello ' + req.params.name);
  return next();
}

//A RegExp can be used to capture a variety of adress
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.put('/hello', send);
server.post('/hello', function create (req, res, next) {
  res.send(201, 'toto');
  return next();
});

//Hanlding annoying favicon request in Chrome
server.get('/favicon.ico', function(req, res, next){
  res.end();
});



/*
 * Versioning
 */

// test with curl -s -H 'accept-version: ~1' localhost:8080/version/toto
//           curl -s -H 'accept-version: ~2' localhost:8080/version/toto
//           curl -s -H 'accept-version: ~3' localhost:8080/version/toto

//We define 2 different callback depending on the version of the API
function respondV1 (req, res, next) {
  res.send('Version 1 ' + req.params.arg);
  return next();
}
function respondV2 (req, res, next) {
  res.send('Version 2 ' + req.params.arg);
  return next();
}

//We route differently according to the version
server.get({path:'/version/:arg', version: '1.0.1'}, respondV1);
server.get({path:'/version/:arg', version: '2.0.0'}, respondV2);

//We can listen to specific events to create custom handlers
//See the doc for the event available
server.on('NotFound', function(req, res) {
  logger.warn('This route doesnt exist');
  res.send(404, 'bad route');
});



/**
 * Bundle Plugins
 * 
 */

//Restify provides plugins (mainly parser) you can add
//like server.use(restify.authorizationParser())

server.use(restify.queryParser());
server.get('/query', function(req, res, next) {
  var param;
  for (param in req.query){
    if (req.query.hasOwnProperty(param)) {
      logger.info(param + ': '+req.query[param]);
    }
  }
  res.send('query with args');
});




var PORT = 8787;

// Start server
server.listen(PORT, function(){
  logger.info(server.name + ' listening at ' + server.url);
 });


 /**
  * Client API : To consume REST API
  *
  */

// Creates a JSON client
var client = restify.createJsonClient({
  url: 'http://localhost:'+PORT
});



client.basicAuth('$login', '$password');
client.get('/hello/tita', function(err, req, res, obj) {

  logger.info('in client');
  console.log(JSON.stringify(obj, null, 2));
});

