var win = require('electron').remote.getCurrentWindow();
var io = require('socket.io-client');
var config = require('./config.js');

//Connecting to socket with auth token
var socket = io.connect(config.http.url, {
	query: 'token=' + win.token
});

//When socket connects get Userlist and Last 10 messages
socket.on('connect', function () {
	socket.emit('getUserStatus');
	socket.emit('getOldMessages');
}).on('disconnect', function () {
	console.log('disconnected');
}).on("error", function(error) {
  if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
    console.log('Unauthorized');
  }
});

//When new message arrives
socket.on('newMessage', function(content) {
	//New message content:
	//content.msg
	//content.user  (usr, avatar)
});

//A new user went online
socket.on('newUserOnline', function(user){
	//Notification that new user is online
	//user.firstname + user.avatar
});

//Loads 10 last messages
socket.on('loadOldMessages', function(messages) {
	messages.forEach(function(message) {
		console.log(message);
	});
});

//Updates the userlist
socket.on('userStatusUpdate', function(userlist) {
	userlist.forEach(function(user) {
		console.log(user);
	});
});

// Window actions
$('#actions .close').on('click', function() {
	win.close();
});
$('#actions .maximize').on('click', function() {
	win.maximize();
});
$('#actions .minimize').on('click', function() {
	win.minimize();
});

// SEND
$('#send').keypress(function(event) {
	var val = $(this).val();
	if(event.keyCode == 13) {
		if(val == "") {
			return false;
		} else {
			alert('SEND MESSAGE!');
		}
	}
});

// GIFS
$('#gifs li').on('click', function() {
	alert('SEND GIF!');
});

// SOUNDS
// Side sounds
$('#sounds li').on('click', function() {
	var sound = $(this).find('audio');
	if($(this).hasClass('playing')) {
		stopSounds();
	} else {
		stopSounds();
		$(this).addClass('playing');
		sound[0].play();
	}
	sound[0].addEventListener('ended', resetSounds);
});
$('#sounds li').on('dblclick', function() {
	stopSounds();
	alert('SEND SOUND!');
});
// Message sounds
$('.message .sound a').on('click', function() {
	var sound = $(this).parent().find('audio');
	if($(this).parent().hasClass('playing')) {
		stopSounds();
		$(this).text('Play');
	} else {
		stopSounds();
		$(this).parent().addClass('playing');
		sound[0].play();
		$(this).text('Stop');
	}
	sound[0].addEventListener('ended', resetSounds);
});
// Stop/Reset sounds
function stopSounds() {
	$('#sounds li').removeClass('playing');
	$('.message .sound').removeClass('playing');
	$('.message .sound a').text('Play');
	$('audio').each(function(){
		this.pause();
		this.currentTime = 0;
	});
}
function resetSounds() {
	$('#sounds li').removeClass('playing');
	$('.message .sound').removeClass('playing');
	$('.message .sound a').text('Play');
}
