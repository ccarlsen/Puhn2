var emoticons = require('./emoticons.js');

function escapeHTML(string) {
	return String(string)
	.replace(/&/g, '&amp;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
	.replace(/\n/g, '<br/>');
}

function escapeRegExp(string) {
	if(string){
		return string.replace(/(['()|\[\]\/\\])/g, '\\$1');
	}
}

function linkify(content) {
	var replacePattern1, replacePattern2;

	replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	content = content.replace(replacePattern1, '<a href="$1">$1</a>');

	replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	content = content.replace(replacePattern2, '$1<a href="http://$2">$2</a>');

	return content;
}

function emojify(content) {
	var emoji = emoticons.emoji;
	$.each(emoji, function(key, value) {
		var replacePattern = new RegExp(escapeRegExp(value.shortcut), 'g');
		content = content.replace(replacePattern,
			'<img src="assets/img/emoji/' + value.file + '" class="emoji" title="' + value.shortcut + '">');
	});
	return content;
}

function memeify(content) {
	var memes = emoticons.memes;
	$.each(memes, function(key, value) {
		var replacePattern = new RegExp(escapeRegExp(value.shortcut), 'g');
		content = content.replace(replacePattern,
			'<img src="assets/img/memes/' + value.file + '" class="meme" title="' + value.shortcut + '">');
	});
	return content;
}

exports.loadEmoticons = function() {
	var emoji = emoticons.emoji;
	var memes = emoticons.memes;
	$.each(emoji, function(key, value) {
		var content = '<li><img src="assets/img/emoji/' + value.file + '"><small>' + value.shortcut + '</small></li>';
		$('#emoji').append(content);
	});
	$.each(memes, function(key, value) {
		var content = '<li><img src="assets/img/memes/' + value.file + '"><small>' + value.shortcut + '</small></li>';
		$('#memes').append(content);
	});
}

exports.chatInputFocus = function() {
	$('#send').focus();
}

exports.timeAgo = function() {
	$('time').timeago();
}

exports.scrollToBottom = function() {
	$('#chat').animate({scrollTop: $('#chat').prop('scrollHeight')}, 200);
}

exports.showNotification = function(content) {
	var notification = new Notification('Puhn2', {
		body: content,
		silent: true
	});
	setTimeout(function() {
		notification.close();
	}, 4000);
}

exports.playSound = function(content) {
	var sound = new Audio();
	sound.setAttribute('src', 'assets/ogg/' + content + '.ogg');
	sound.setAttribute('type', 'audio/ogg');
	sound.play();
}

exports.getProcessedMessage = function(content) {

	var imageRegex 	= /(\/image https?:\/\/.*\.(?:png|jpg|gif))/g;
	var imageTest 	= imageRegex.test(content);
	var imageURL 	= content.replace('/image ', '');

	var gifRegex 	= /(\/gif https?:\/\/.*\.(?:gif|gifv|webm))/g;
	var gifTest 	= gifRegex.test(content);
	var gifURL 		= content.replace('/gif ', '');

	if (imageTest) {
		content = '<div class="image"><div class="inner"><img src="'+ imageURL +'"><span><a href="'+ imageURL +'">'+ imageURL +'</a></span></div></div>';
	} else if (gifTest) {
		alert(gifURL);
	} else {
		content = escapeHTML(content);
		content = linkify(content);
		content = emojify(content);
		content = memeify(content);
	}

	return content;
}