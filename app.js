
/**
 * Module dependencies
 */
var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  fs = require('fs'),
  http = require('http'),
  io = require('socket.io'),
  path = require('path');

var app = module.exports = express()
  , server = require('http').createServer(app)
  , io = io.listen(server);

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');
  

var os = require("os");
if(os.hostname()=="Lim-PC"){  
  var db = new Db('app22495549', new Server("127.0.0.1", 27017,
  {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});
}else{
  var db = new Db('app22495549', new Server("troup.mongohq.com", 10055,
   {auto_reconnect: false, poolSize: 4}), {w:0, native_parser: false});
}

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
 * Start Server
 */
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

var nicknames = {};
var numUsers = 0;


// Establish connection to db
db.open(function(err, db) {
  assert.equal(null, err);
  assert.ok(db != null);
  db.authenticate('lim', 'nodejslim', function(err, result) {
    io.sockets.on('connection', function (socket) {
      nicknames[socket.id]='Guest';
      socket.nickname='Guest';
      numUsers++;
      io.sockets.emit("count connection", {count: numUsers });
      socket.emit("socket config", {id: socket.id});
      socket.on('disconnect', function() {
        delete nicknames[socket.id];
        numUsers--;
        socket.broadcast.emit("count connection", {count: numUsers });
        // db.close();
      });
      socket.on('update:config', function (data) {
        if(socket.nickname != data.config.name){
          // add the client's nickname to the global list
          nicknames[socket.id] = data.config.name;
          // echo globally (all clients) that a person has connected
          socket.broadcast.emit('nickname changed', {
            msg: socket.nickname + "(id: " + socket.id + ") has changed nickname to " + data.config.name
          }); 
          socket.nickname = data.config.name;
        }
      });
      socket.on('send:msg', function (data) {
        var message=socket.nickname + " say: \n" + data.msg;
        io.sockets.emit('receive:msg', {
          msg: message
        }); 
      });
      socket.on('init:mongochat', function () {
        var collection = db.collection("mongochat");
        collection.find({},{msg:1,_id:0}).limit(100).toArray(function(err, results){
          socket.emit('init:mongochat', {
            msgs: results
          });
        });
      });
      socket.on('send:mongomsg', function (data) {
        var message=socket.nickname + " say: \n" + data.msg;
        var collection = db.collection("mongochat");
        collection.insert( { msg: message } );
        io.sockets.emit('receive:mongomsg', {
          msg: message
        }); 
      });
    });
  });
});