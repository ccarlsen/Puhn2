var emoticons 	= require('./emoticons.js');
var config		= require('./config.js');

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

exports.loadWebms = function() {
	$.get( config.http.url + '/webms', function( webms ) {
		$('#gifs').html('');
		webms.forEach(function(webm) {
			var content = '<li id="' + webm._id + '" data-link="' + webm.domain + webm.link + '" data-width="' + webm.width + '" data-height="' + webm.height + '"><img src="' + webm.domain + webm.thumblink + '"></li>';
			$('#gifs').append(content);
		});
	});
}

exports.deleteWebmById = function(id, callback) {
	$.ajax({
    url: config.http.url + '/webms/' + id,
    type: 'DELETE',
    success: function(result) {
        callback();
    }
	});
}

exports.loadSounds = function() {
	$.get( config.http.url + '/sounds', function( sounds ) {
		$('#sounds').html('');
		sounds.forEach(function(sound) {
			var format = 'audio/mpeg';
			switch(sound.format){
				case 'mp3':
					format = 'audio/mpeg';
					break;
				case 'wav':
					format = 'audio/wav';
					break;
				case 'ogg':
					format = 'audio/ogg';
					break;
			}
			var content = '<li id="' + sound._id + '">' + sound.title + '<audio data-title="' + sound.title + '"><source src="' + sound.domain + sound.link + '" type="' + format + '"></audio></li>';
			$('#sounds').append(content);
		});
	});
}

exports.deleteSoundById = function(id, callback) {
	$.ajax({
    url: config.http.url + '/sounds/' + id,
    type: 'DELETE',
    success: function(result) {
        callback();
    }
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
	var notification = new Notification('Wayne', {
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

exports.getProcessedMessage = function(message) {
	var content = {};
	content.message = message;
	content.mode = 'DEFAULT';

	var imageRegex 	= /(\/image https?:\/\/.*\.(?:png|jpg|gif))/g;
	var imageTest 	= imageRegex.test(content.message);
	var imageURL 	= message.replace('/image ', '');

	var gifRegex 	= /\/gif\s((https?):\/\/.*\.(?:gif|gifv|webm))(\s(w|h)(\d+))?/g;
	var gifMatch 	= gifRegex.exec(content.message);

	var soundRegex 	= /\/sound\s((https?):\/\/.*\.(?:mp3|ogg|wav))\s(.*)/g;
	var soundMatch 	= soundRegex.exec(content.message);

	if (imageTest) {
		content.message = '<div class="image"><div class="inner"><img src="'+ imageURL +'"><span><a href="'+ imageURL +'">'+ imageURL +'</a></span></div></div>';
	} else if (gifMatch != null) {
		content.url = gifMatch[1];
		content.protocol = gifMatch[2];
		content.resizemode = gifMatch[4];
		content.size = gifMatch[5];
		content.mode = 'GIFWEBM';
	} else if (soundMatch != null) {
		content.url = soundMatch[1];
		content.protocol = soundMatch[2];
		content.title = soundMatch[3];
		content.mode = 'SOUND';
	} else {
		content.message = escapeHTML(content.message);
		content.message = linkify(content.message);
		content.message = emojify(content.message);
		content.message = memeify(content.message);
	}

	return content;
}
