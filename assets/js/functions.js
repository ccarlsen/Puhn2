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
	var emoji = [
		{ "file": "crying.svg", "shortcut": ":S" },
		{ "file": "dissapointed.svg", "shortcut": "-_-" },
		{ "file": "smile.svg", "shortcut": ":)" },
		{ "file": "sad.svg", "shortcut": ":(" },
		{ "file": "laugh.svg", "shortcut": ":D" },
		{ "file": "surprised.svg", "shortcut": ":O" },
		{ "file": "tongue.svg", "shortcut": ":P" },
		{ "file": "worried.svg", "shortcut": ":/" },
		{ "file": "wink.svg", "shortcut": ";)" }
	];

	$.each(emoji, function(key, value) {
		var replacePattern = new RegExp(escapeRegExp(value.shortcut), 'g');
		content = content.replace(replacePattern,
			'<img src="assets/img/emoji/' + value.file + '" class="emoji" title="' + value.shortcut + '">');
	});

	return content;
}

function memeify(content) {
	var memes = [
		{ "file": "aliens.jpg", "shortcut": "aliens;" },
		{ "file": "arn.jpg", "shortcut": "arn;" },
		{ "file": "arn2.jpg", "shortcut": "arn2;" },
		{ "file": "aww.jpg", "shortcut": "aww;" },
		{ "file": "brain.jpg", "shortcut": "brain;" },
		{ "file": "close.jpg", "shortcut": "close;" },
		{ "file": "cry.jpg", "shortcut": "cry;" },
		{ "file": "cryfu.jpg", "shortcut": "cryfu;" },
		{ "file": "dafuq.jpg", "shortcut": "dafuq;" },
		{ "file": "dat.jpg", "shortcut": "dat;" },
		{ "file": "dawg.jpg", "shortcut": "dawg;" },
		{ "file": "dont.jpg", "shortcut": "dont;" },
		{ "file": "er.jpg", "shortcut": "er;" },
		{ "file": "fa.jpg", "shortcut": "fa;" },
		{ "file": "fpalm.jpg", "shortcut": "fpalm;" },
		{ "file": "fu.jpg", "shortcut": "ffuu;" },
		{ "file": "fyea.jpg", "shortcut": "fyea;" },
		{ "file": "genius.jpg", "shortcut": "genius;" },
		{ "file": "gusta.jpg", "shortcut": "gusta;" },
		{ "file": "hah.jpg", "shortcut": "hah;" },
		{ "file": "happy.jpg", "shortcut": "o)" },
		{ "file": "herp.jpg", "shortcut": "herp;" },
		{ "file": "holy.jpg", "shortcut": "holy;" },
		{ "file": "impo.jpg", "shortcut": "impo;" },
		{ "file": "isee.jpg", "shortcut": "isee;" },
		{ "file": "jordan.jpg", "shortcut": "jordan;" },
		{ "file": "lol.jpg", "shortcut": "lol;" },
		{ "file": "lool.jpg", "shortcut": "LOL;" },
		{ "file": "luck.jpg", "shortcut": "luck;" },
		{ "file": "mog.jpg", "shortcut": "mog;" },
		{ "file": "notbad.jpg", "shortcut": "notbad;" },
		{ "file": "nvm.jpg", "shortcut": "nvm;" },
		{ "file": "ok.jpg", "shortcut": "ok;" },
		{ "file": "ru.jpg", "shortcut": "ru;" },
		{ "file": "sweet.jpg", "shortcut": "sweet;" },
		{ "file": "true.jpg", "shortcut": "true;" },
		{ "file": "waiting.jpg", "shortcut": "waiting;" },
		{ "file": "why.jpg", "shortcut": "why;" },
		{ "file": "yay.jpg", "shortcut": "yay;" },
		{ "file": "yo.jpg", "shortcut": "yo;" },
		{ "file": "yuno.jpg", "shortcut": "yuno;" }
	];

	$.each(memes, function(key, value) {
		var replacePattern = new RegExp(escapeRegExp(value.shortcut), 'g');
		content = content.replace(replacePattern,
			'<img src="assets/img/memes/' + value.file + '" class="meme" title="' + value.shortcut + '">');
	});

	return content;
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

	if (imageTest) {
		content = '<div class="image"><div class="inner"><img src="'+ imageURL +'"><span><a href="'+ imageURL +'">'+ imageURL +'</a></span></div></div>';
	} else {
		content = escapeHTML(content);
		content = linkify(content);
		content = emojify(content);
		content = memeify(content);
	}

	return content;
}