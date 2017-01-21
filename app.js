/**
 * Projet SpreasSheet.io, 
 * dans le cadre de la Licence Pro. TAIS option Dév. Web
 * à Haguenau
 * 
 * app.js
 * 
 * Auteurs: 
 * David Faby
 * Antoine Guingand
 * 
 * 2016-2017
 */

///// Importation des Library
// express
var express = require('express');
var session  = require('express-session');
// third-party
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();

/// Configuration Passport.js
var passport = require('passport');
var flash    = require('connect-flash');

/// Configuration Socket.io
var server = require('http').Server(app);

/// Configuration Moteur de rendu ECT.js
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });


//// Définition de ECT dans express
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

///// Configuration de passport
require('./config/passport')(passport);


//////////////// MIDDLEWARES /////////////////////////////////

//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var sessionMiddleware = session({
	secret: 'vidyapathaisalwaysrunning',
  key: 'express.sid',
  resave: true,
  saveUninitialized: true
 })

app.use(sessionMiddleware); 



app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(express.static('public'));
app.use('/cloud',express.static('cloud'));

//////////// ROUTE ///////////////////

require('./routes')(app, passport);


/////// lancement de l'App

server.listen(23000,function () {
  console.log('Example app listening on port 23000 !');
});


var sharedsession = require("express-socket.io-session");

var associateDatas = [];

//////// SOCKETS

var cloud = require('./app/cloud');
var update = require('./app/update');
var util = require('./app/util');

var inspect = require('util').inspect;

var io = require('socket.io')(server);

/*io.use(sharedsession(session, {
    autoSave:true
}));*/


var socketList = {};

function getRoomUsers(roomID) {
  var fileUsers = [];
   Object.keys(socketList).forEach(function(socketId) {
    var socket = socketList[socketId];
    if(socket.room === roomID) {
      fileUsers.push({
        user : socket.user
      })
    }
  });
  return fileUsers;
}

io.on('connection', function(socket) {
  console.log('{SOCKET.IO} Nouvelle connexion');
  
  
  socket.on('Client Infos', function(data) {
    var fid = data.file.id;
    console.log('Client Infos',data);
    socket.join(fid);

    var newSocket = {
      room : fid,
      user : {
        username : data.user.username
      }
    };
    Object.keys(socketList).forEach(function(socketId) {
      var socket = socketList[socketId];
      if(socket.room === newSocket.room &&
         socket.user.username == newSocket.user.username
         ) {
          delete socketList[socketId];
      }
    });
    socketList[socket.id] = newSocket;
    console.log('socketList = ',socketList);

    var fileUsers = getRoomUsers(fid);
    console.log('ROOM '+fid+' | fileUsers = ',fileUsers);
    
    socket.emit('collaborators',fileUsers);
    socket.to(fid).emit('collaborators',fileUsers);
  });

  socket.on('disconnect', function() {
      console.log('Got disconnect!');
      if(typeof socketList[socket.id] == "undefined")
        return;

      var fid = socketList[socket.id].room;
      
      delete socketList[socket.id];
      var fileUsers = getRoomUsers(fid);
      socket.to(fid).emit('collaborators', fileUsers);
   });
  socket.on('cell change', function(changes) {
    console.log("cell change in ", socketList[socket.id].room);
    console.log("changes : ",changes);
    var cell =  {
      row: changes[0],
      col: changes[1],
      data: changes[3]
    };
    socket.broadcast
    .to(socketList[socket.id].room)
    .emit('external cell change', {
      user : socketList[socket.id].user,
      cell: cell
    });
    cloud.save(
      socketList[socket.id].room,
      changes.map(function(change) {
        return {
          cell: cell,
          type: update.UpdateType.CELL_CHANGE
        }
    }));
  });
  socket.on('new selection', function(coords) {
    socket.broadcast
    .to(socketList[socket.id].room)
    .emit('external selection', {
      user:socketList[socket.id].user, 
      selection:coords
    });
  });
});