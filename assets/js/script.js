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
$('.Chat-close').on('click', function() {
	win.close();
});
$('.Chat-maximize').on('click', function() {
	win.maximize();
});
$('.Chat-minimize').on('click', function() {
	win.minimize();
});

$('.Side-gifs').on('scroll', function() {
	if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
		$('.Side').addClass('bottomOfGifs');
	} else {
		$('.Side').removeClass('bottomOfGifs');
	}
});

$('.Side-sounds').on('scroll', function() {
	if($(this).scrollTop() > 1) {
		$('.Side').addClass('notTopOfSounds');
	} else {
		$('.Side').removeClass('notTopOfSounds');
	}
});

$('.Side-sounds li').on('click', function() {

	var element = $(this);
	var timeline = new TimelineMax({paused:true});
	var progress = element.find('span i');
	var sound = element.find('audio');
	var seconds = element.attr('data-seconds');

	stopSounds(element);

	timeline
		.add(function(){sound[0].play();})
		.to(progress, seconds, {css:{width: '100%'}, ease:Power0.easeNone})
		.add(function(){element.removeClass('playing');})
		.to(progress, 0, {css:{width: '0%'}});

	if(element.hasClass('playing')) {
		element.removeClass('playing');
	} else {
		element.addClass('playing');
		timeline.play();
	}

});

$('.Side-sounds li').on('dblclick', function() {
	console.log('send');
	stopSounds();
});

function stopSounds(el) {
	$('.Side-sounds li').not(el).removeClass('playing');
	$('.Side-sounds li span i').not(el).width('0%');
	TweenMax.killAll();
	$('audio').each(function(){
		this.pause();
		this.currentTime = 0;
	});
}
