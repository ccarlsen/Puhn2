const {remote} = require('electron');
const {Menu, MenuItem, shell, app} = remote;
var win 		= remote.getCurrentWindow();
var io 			= require('socket.io-client');
var config 		= require('./config.js');
var functions 	= require('./functions.js');

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
		if (process.platform == 'darwin') {
			app.dock.bounce('critical');
		}
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

// When a user is typing
socket.on('typing', function(data){
	if (data.isTyping) {
		$('#typing').html('<strong>' + data.user + '</strong> is typing');
	} else {
		$('#typing').html('');
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

// Load gifs and sounds
socket.on('loadWebms', function(){
	functions.loadWebms();
});
socket.on('loadSounds', function(){
	functions.loadSounds();
});

// When sound is received
socket.on('receiveSound', function(id) {
	stopSounds();
	var sound = $('#' + id).find('audio');
	sound[0].play();
	sound[0].addEventListener('ended', resetSounds);
	$('#' + id).addClass('playing');
	setTimeout(function() {
		$('.sound a[data-id="'+ id +'"]').last().text('Stop');
	}, 100);
});

// Submitting a message
$('#send').on('keypress', function(event) {
	var val = $(this).val();
	if(event.keyCode == 13) {
		if(val == '') {
			return false;
		} else {
			$(this).val('');
			var content = functions.getProcessedMessage(val);
			switch (content.mode) {
				case 'GIFWEBM':
					socket.emit('uploadGifWebm', content);
					break;
				case 'SOUND':
					socket.emit('uploadSound', content);
					break;
				default:
					socket.emit('sendMessage', content.message);
					functions.chatInputFocus();
			}
			socket.emit('stopTyping');
		}
	}
});

// Focus on input when ready and when clicking anywhere
$(document).on('ready', function() {
	functions.chatInputFocus();
	functions.loadEmoticons();
	functions.loadWebms();
	functions.loadSounds();
});

// Add shadow if not scrolled to bottom
$('#chat').on('scroll', function() {
	var scrollTop = $(this).scrollTop();
	var innerHeight = $(this).innerHeight();
	var scrollHeight = $(this)[0].scrollHeight;
	if (scrollTop + innerHeight >= scrollHeight - 5) {
		$('#message').removeClass('not-bottom');
	} else {
		$('#message').addClass('not-bottom');
	}
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
var gifToDelete = null;
var gifMenu = new Menu();
var gifMenuItem = new MenuItem({
	label: 'Delete',
	click: () => {
		functions.deleteWebmById(gifToDelete, function(){
			socket.emit('updateWebms');
		});
		functions.chatInputFocus();
	}
});

gifMenu.append(gifMenuItem);

$('#gifs').on('click', 'li', function() {
	var webmHtml = '<video width="' + $(this).data('width') + '" height="' + $(this).data('height') + '" src="' + $(this).data('link') + '" class="webm" autoplay="" loop="" muted="muted"></video>';
	socket.emit('sendMessage', webmHtml);
	$('#preview').html('');
	$('#preview').hide();
	functions.chatInputFocus();
});

$('#gifs').on('contextmenu', 'li', function(event) {
	event.preventDefault();
	gifMenu.popup(remote.getCurrentWindow());
	gifToDelete = $(this).attr('id')
});

$('#gifs').on('mouseover', 'li', function() {
	$('#preview').html('<video width="' + $(this).data('width') + '" height="' + $(this).data('height') + '" src="' + $(this).data('link') + '" class="webm" autoplay="" loop="" muted="muted"></video>');
	$('#preview').show();
});

$('#gifs').on('mouseleave', 'li', function() {
	$('#preview').html('');
	$('#preview').hide();
});

// SOUNDS
var soundToDelete = null;
var soundMenu = new Menu();
var soundMenuItem = new MenuItem({
	label: 'Delete',
	click: () => {
		functions.deleteSoundById(soundToDelete, function(){
			socket.emit('updateSounds');
		});
		functions.chatInputFocus();
	}
});

soundMenu.append(soundMenuItem);

$('#sounds').on('click', 'li', function() {
	var sound = $(this).find('audio');
	if($(this).hasClass('playing')) {
		stopSounds();
	} else {
		stopSounds();
		$(this).addClass('playing');
		sound[0].play();
	}
	sound[0].addEventListener('ended', resetSounds);
	functions.chatInputFocus();
});

$('#sounds').on('dblclick', 'li', function() {
	var id = $(this).attr('id');
	var title = $(this).find('audio').data('title');
	var content = '<div class="sound"><span>' + title + '</span><a href="#" data-id="' + id + '">Play</a></div>';
	socket.emit('sendSound', id);
	socket.emit('sendMessage', content);
	functions.chatInputFocus();
});

$('#sounds').on('contextmenu', 'li', function(event) {
	event.preventDefault();
	soundMenu.popup(remote.getCurrentWindow());
	soundToDelete = $(this).attr('id')
});

$('#messages').on('click', '.message .sound a', function() {
	var soundId = $(this).data('id');
	var sound = $('#' + soundId).find('audio');
	if($('#' + soundId).hasClass('playing')) {
		stopSounds();
		$(this).text('Play');
	} else {
		stopSounds();
		$('#' + soundId).addClass('playing');
		sound[0].play();
		$(this).text('Stop');
	}
	sound[0].addEventListener('ended', resetSounds);
	functions.chatInputFocus();
});

function stopSounds() {
	$('#sounds li').removeClass('playing');
	$('.sound a').text('Play');
	$('audio').each(function(){
		this.pause();
		this.currentTime = 0;
	});
}

function resetSounds() {
	$('#sounds li').removeClass('playing');
	$('.sound a').text('Play');
}