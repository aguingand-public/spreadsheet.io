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

app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); 

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(express.static('public'));

//////////// ROUTE ///////////////////

require('./routes')(app, passport);


/////// lancement de l'App

server.listen(23000,function () {
  console.log('Example app listening on port 23000 !');
});


var associateFileId = [];

//////// SOCKETS
var io = require('socket.io')(server);
var cloud = require('./app/cloud');
var update = require('./app/update'); 
io.on('connection', function(socket) {
  process.stdout.write('{SOCKET.IO} Nouvelle connexion ');
  socket.on('Client Infos', function(data) {
    var fid = data.file.id;
    console.log('FileId = '+fid);
    socket.join(fid.toString());
    associateFileId[socket.id] = fid;
  });
  socket.on('cell change', function(changes) {
    cloud.save(
      associateFileId[socket.id],
      changes.map(function(change) {
        return {
          cell: {
            x: change[1],
            y: change[0],
            data: change[3]
          },
          type: update.UpdateType.CELL_CHANGE
        }
    }));
  });
});