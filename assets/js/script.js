var remote 		= require('electron').remote;
var win 		= remote.getCurrentWindow();
var io 			= require('socket.io-client');
var config 		= require('./config.js');
var functions 	= require('./functions.js');
var shell 		= remote.shell;
var app			= remote.app;

// Connecting to socket with auth token
var socket = io.connect(config.http.url, {
	query: 'token=' + win.token
});

// When socket connects get users list and last 10 messages
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

// When a new message arrives
socket.on('newMessage', function(content) {
	var message = '';
	var date = new Date();
	var lastuser = $('#messages div.message:last-child').attr('data-user');
	if (content.user.usr == lastuser) {
		message = '<div class="append">'+ content.msg +'<time datetime="' + date.toISOString() + '"></time></div>';
		$('#messages div.message:last-child').append(message);
	} else {
		message = '<div class="message" data-user="' + content.user.usr + '"><div class="avatar"><img src="' + content.user.avatar + '"></div><div class="content">'+ content.msg +'<time datetime="' + date.toISOString() + '"></time></div>'
		$('#messages').append(message);
	}

	if(!win.isFocused()) {
		functions.playSound('message');
		win.flashFrame(true);
		app.dock.bounce('critical');
	}
	functions.scrollToBottom();
	functions.timeAgo();
});

// When a user comes online
socket.on('newUserOnline', function(user) {
	functions.showNotification(user.firstname +' just logged in');
	functions.playSound('login');
});

// Loads 10 last messages
socket.on('loadOldMessages', function(messages) {
	messages.forEach(function(content) {
		var message 	= '';
		var lastuser 	= $('#messages div.message:last-child').attr('data-user');
		if (content._creator.usr == lastuser) {
			message = '<div class="append">'+ content.msg +'<time datetime="' + content.created + '"></time></div>';
			$('#messages div.message:last-child').append(message);
		} else {
			message = '<div class="message" data-user="' + content._creator.usr + '"><div class="avatar"><img src="' + content._creator.avatar + '"></div><div class="content">'+ content.msg +'<time datetime="' + content.created + '"></time></div>'
			$('#messages').append(message);
		}
	});
	functions.scrollToBottom();
	functions.timeAgo();
});

// Updates the users list
socket.on('userStatusUpdate', function(userlist) {
	var html = '';
	userlist.forEach(function(user) {
		if (user.status == '1') {
			html += '<div data-status="online">' + user.firstname + '<time datetime="' + user.signedDate + '"></time></div>';
		} else {
			html += '<div data-status="offline">' + user.firstname + '<time datetime="' + user.signedDate + '"></time></div>';
		}
	});
	$("#users").html(html);
	functions.timeAgo();
});

socket.on('typing', function(data){
	if (data.isTyping) {
		$('#typing').html('<strong>' + data.user + '</strong> is typing');
	} else {
		$('#typing').html('');
	}
});

// Submitting a message
$('#send').on('keypress', function(event) {
	var val = $(this).val();
	if(event.keyCode == 13) {
		if(val == '') {
			return false;
		} else {
			$(this).val('');
			socket.emit('sendMessage', functions.getProcessedMessage(val));
			socket.emit('stopTyping');
			console.log(app);
		}
	}
});

$('#send').on('input', function() {
	if ($(this).val() == '') {
		socket.emit('stopTyping');
	}
	else {
		socket.emit('startTyping');
	}
});

$('#send').focusout(function() {
	socket.emit('stopTyping');
});

// Focus on input when ready and when clicking anywhere
$(document).on('ready', function() {
	functions.chatInputFocus();
	functions.loadEmoticons();
});
$('body').on('click', function() {
	functions.chatInputFocus();
});

// Open links in default browser
$(document).on('click', 'a[href^="http"]', function(event) {
	event.preventDefault();
	shell.openExternal(this.href);
});

// Show emoticons on smiley hover
$('#smiley').on('mouseover', function() {
	$('#emoticons').show();
});
$('#smiley').on('mouseleave', function() {
	$('#emoticons').hide();
});

// GIFS
/*
$('#gifs li').on('click', function() {
	alert('SEND GIF!');
});
*/

// SOUNDS
/*
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
*/
