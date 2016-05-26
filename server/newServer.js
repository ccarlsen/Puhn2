var express = require('express');
var jwt = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');
var mongo = require('./mongo');
var LEX = require('letsencrypt-express');
var https = require('spdy');
//Chat Variables
var users = {};
var sockets = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.post('/login', function (req, res) {
  mongo.userAuthenticate(req.body.username, req.body.password, function (isValid) {
    if(isValid){
      mongo.getFullUserByUsername(req.body.username, function (user) {
        var token = jwt.sign(user, config.crypto.jwtSecret, { expiresIn: "10h" });
        res.json({token: token});
      });
    } else {
      res.status(401).send('login incorrect');
    }
  });
});

//letsencrypt https config
var lex = LEX.create({
  configDir: '/etc/letsencrypt',
  approveRegistration: function (hostname, cb) {
    cb(null, {
      domains: ['puhn.co']
    , email: 'madetho@live.de'
    , agreeTos: true
    });
  }
});

var server = https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, app));
var io = require('socket.io')(server);
server.listen(config.http.port);

io.use(socketioJwt.authorize({
  secret: config.crypto.jwtSecret,
  handshake: true
}));

io.sockets.on('connection', function (socket) {
  var docUser = socket.decoded_token._doc;
  mongo.updateUserStatus(docUser.usr, 1, Date(), function() {
    mongo.getFullUserByUsername(docUser.usr, function (user) {
      console.log(user.firstname + ' is now online');
      users[socket.id] = user;
      sockets[user._id] = socket;
      socket.broadcast.emit('newUserOnline', user);
    });
  });

  socket.on('getUserStatus', function(){
    updateUserStatus();
  });

  function updateUserStatus(){
    mongo.getAllUser(function(users) {
      console.log('Get all users for status bar');
      io.sockets.emit('userStatusUpdate', users);
    });
  }

  //Load old messages
  socket.on('getOldMessages', function(){
    mongo.getLastMessages(10, function(messages){
      messages.reverse();
      console.log('Loaded old messages');
      socket.emit('loadOldMessages', messages);
    });
  });

  //Messages Chat to Chat
  socket.on('sendMessage', function(message){
    mongo.createNewMessage(users[socket.id]._id, message, function(done) {
      if(done) {
        console.log(users[socket.id].firstname + ': ' + message);
        io.sockets.emit('newMessage', {msg: message, user: users[socket.id]});
      }
    });
  });

  //Typing
  socket.on('startTyping', function(){
    socket.broadcast.emit('typing', {isTyping: true, user: users[socket.id].firstname});
  });

  socket.on('stopTyping', function(){
    socket.broadcast.emit('typing', {isTyping: false, user: users[socket.id].firstname});
  });

  //User disconnected
  socket.on('disconnect', function(){
		if(!users[socket.id]) return;
		mongo.updateUserStatus(users[socket.id].usr, 0, Date(), function() {
			console.log(users[socket.id].firstname + ' is now offline');
			delete sockets[users[socket.id]._id];
			delete users[socket.id];
			updateUserStatus();
		});
	});
});

server.listen(config.http.port, function () {
  console.log('Listening on ' + config.http.port);
});
