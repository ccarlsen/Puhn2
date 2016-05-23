//////////////////////////////////////////////////
exports.chatInputFocus = function() {
	$('#send').focus();
}

//////////////////////////////////////////////////
exports.timeAgo = function() {
	$('time').timeago();
}

//////////////////////////////////////////////////
exports.scrollToBottom = function() {
	$('#chat').animate({scrollTop: $('#chat').prop('scrollHeight')}, 200);
}

//////////////////////////////////////////////////
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

//////////////////////////////////////////////////
function escapeRegExp(string) {
	if(string){
		return string.replace(/(['()|\[\]\/\\])/g, '\\$1');
	}
}

//////////////////////////////////////////////////
function linkify(inputText) {
	var replacePattern1, replacePattern2;

	replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	inputText = inputText.replace(replacePattern1, '<a href="$1">$1</a>');

	replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	inputText = inputText.replace(replacePattern2, '$1<a href="http://$2">$2</a>');

	return inputText;
}

//////////////////////////////////////////////////
function emojify(inputText) {
	var emoji = [
		{ "file": "crying.png", "shortcut": ":'(" },
		{ "file": "dissapointed.png", "shortcut": "-_-" },
		{ "file": "happy.png", "shortcut": ":)" },
		{ "file": "sad.png", "shortcut": ":(" },
		{ "file": "smile.png", "shortcut": ":D" },
		{ "file": "surprised.png", "shortcut": ":O" },
		{ "file": "tongue.png", "shortcut": ":P" },
		{ "file": "unsure.png", "shortcut": ":S" },
		{ "file": "wink.png", "shortcut": ";)" }
	];

	$.each(emoji, function(key, value) {
		var replacePattern = new RegExp(escapeRegExp(value.shortcut), 'g');
		inputText = inputText.replace(replacePattern,
			'<img src="../assets/img/emoji/' + value.file + '" class="emoji" title="' + value.shortcut + '">');
	});

	return inputText;
}

//////////////////////////////////////////////////
function memeify(inputText) {
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
		inputText = inputText.replace(replacePattern,
			'<img src="../assets/img/memes/' + value.file + '" class="meme" title="' + value.shortcut + '">');
	});

	return inputText;
}

//////////////////////////////////////////////////
function webmify(inputText) {
	var webm = [
		{ "file": "banderas.webm", "width": 200, "height": 200, "shortcut": "banderas;" },
		{ "file": "blown.webm", "width": 200, "height": 200, "shortcut": "blown;" },
		{ "file": "boom.webm", "width": 200, "height": 200, "shortcut": "boom;" },
		{ "file": "bullshit.webm", "width": 200, "height": 200, "shortcut": "bullshit;" },
		{ "file": "bye.webm", "width": 200, "height": 200, "shortcut": "bye;" },
		{ "file": "bye2.webm", "width": 200, "height": 200, "shortcut": "bye2;" },
		{ "file": "cereal.webm", "width": 200, "height": 200, "shortcut": "cereal;" },
		{ "file": "doit.webm", "width": 200, "height": 200, "shortcut": "doit;" },
		{ "file": "doit2.webm", "width": 200, "height": 200, "shortcut": "doit2;" },
		{ "file": "fap.webm", "width": 200, "height": 200, "shortcut": "fap;" },
		{ "file": "forgotme.webm", "width": 200, "height": 200, "shortcut": "forgotme;" },
		{ "file": "fuckyou.webm", "width": 200, "height": 200, "shortcut": "fuckyou;" },
		{ "file": "gavefuck.webm", "width": 200, "height": 200, "shortcut": "gavefuck;" },
		{ "file": "han.webm", "width": 200, "height": 200, "shortcut": "han;" },
		{ "file": "heart.webm", "width": 200, "height": 200, "shortcut": "heart;" },
		{ "file": "hehe.webm", "width": 300, "height": 200, "shortcut": "hehe;" },
		{ "file": "holdback.webm", "width": 200, "height": 200, "shortcut": "holdback;" },
		{ "file": "huell.webm", "width": 200, "height": 200, "shortcut": "huell;" },
		{ "file": "huh.webm", "width": 200, "height": 200, "shortcut": "huh;" },
		{ "file": "kanye.webm", "width": 200, "height": 200, "shortcut": "kanye;" },
		{ "file": "mj.webm", "width": 200, "height": 200, "shortcut": "mj;" },
		{ "file": "nah.webm", "width": 200, "height": 200, "shortcut": "nah;" },
		{ "file": "nice.webm", "width": 200, "height": 200, "shortcut": "nice;" },
		{ "file": "nice2.webm", "width": 200, "height": 200, "shortcut": "nice2;" },
		{ "file": "nice3.webm", "width": 200, "height": 200, "shortcut": "nice3;" },
		{ "file": "nice4.webm", "width": 200, "height": 200, "shortcut": "nice4;" },
		{ "file": "nicetry.webm", "width": 200, "height": 200, "shortcut": "nicetry;" },
		{ "file": "no.webm", "width": 200, "height": 200, "shortcut": "no;" },
		{ "file": "no2.webm", "width": 200, "height": 200, "shortcut": "no2;" },
		{ "file": "nod.webm", "width": 200, "height": 200, "shortcut": "nod;" },
		{ "file": "noo.webm", "width": 200, "height": 200, "shortcut": "noo;" },
		{ "file": "nope.webm", "width": 200, "height": 200, "shortcut": "nope;" },
		{ "file": "obama.webm", "width": 200, "height": 200, "shortcut": "obama;" },
		{ "file": "ohh.webm", "width": 200, "height": 200, "shortcut": "ohh;" },
		{ "file": "okay.webm", "width": 200, "height": 200, "shortcut": "okay;" },
		{ "file": "okay2.webm", "width": 200, "height": 200, "shortcut": "okay2;" },
		{ "file": "popcorn.webm", "width": 200, "height": 200, "shortcut": "popcorn;" },
		{ "file": "popcorn2.webm", "width": 200, "height": 200, "shortcut": "popcorn2;" },
		{ "file": "right.webm", "width": 200, "height": 200, "shortcut": "right;" },
		{ "file": "shaq.webm", "width": 200, "height": 200, "shortcut": "shaq;" },
		{ "file": "shutup.webm", "width": 200, "height": 200, "shortcut": "shutup;" },
		{ "file": "small.webm", "width": 200, "height": 200, "shortcut": "small;" },
		{ "file": "snoop.webm", "width": 200, "height": 200, "shortcut": "snoop;" },
		{ "file": "suicide.webm", "width": 200, "height": 200, "shortcut": "suicide;" },
		{ "file": "swag.webm", "width": 200, "height": 200, "shortcut": "swag;" },
		{ "file": "thanks.webm", "width": 200, "height": 200, "shortcut": "thanks;" },
		{ "file": "thankyou.webm", "width": 300, "height": 200, "shortcut": "thankyou;" },
		{ "file": "time.webm", "width": 200, "height": 200, "shortcut": "time;" },
		{ "file": "uhh.webm", "width": 200, "height": 200, "shortcut": "uhh;" },
		{ "file": "uhh2.webm", "width": 200, "height": 200, "shortcut": "uhh2;" },
		{ "file": "where.webm", "width": 200, "height": 200, "shortcut": "where;" },
		{ "file": "win.webm", "width": 200, "height": 200, "shortcut": "win;" },
		{ "file": "wtf.webm", "width": 200, "height": 200, "shortcut": "wtf;" },
		{ "file": "wtf2.webm", "width": 200, "height": 200, "shortcut": "wtf2;" },
		{ "file": "yup.webm", "width": 200, "height": 200, "shortcut": "yup;" }
	];

	$.each(webm, function(key, value) {
		var replacePattern = new RegExp(escapeRegExp(value.shortcut), 'g');
		inputText = inputText.replace(replacePattern,
			'<video width="' + value.width + '" height="' + value.height + '" src="../assets/webm/' + value.file + '" class="webm" autoplay="" loop="" muted="muted" title="' + value.shortcut + '"></video>');
	});

	return inputText;
}

//////////////////////////////////////////////////
exports.getProcessedMessage = function(content) {

	var imageRegex 	= /(\/image https?:\/\/.*\.(?:png|jpg|gif))/g;
	var imageTest 	= imageRegex.test(content);
	var imageURL 	= content.replace('/image ', '');

	var codeRegex 	= /(<pre>(.|\n)*<\/pre>)/g;
	var codeTest 	= codeRegex.test(content);
	var codePRE 	= content.replace('<pre>', '').replace('</pre>', '');

	var drawRegex 	= /(data:image\/png.*)/g;
	var drawTest 	= drawRegex.test(content);
	var drawURL 	= content;

	if (imageTest) {
		content 	= '<img src="'+ imageURL +'" class="image" title="'+ imageURL +'">';
	} else if (codeTest) {
		content 	= '<code>' + escapeHTML(codePRE) + '</code>';
	} else if (drawTest) {
		content 	= '<img src="'+ drawURL +'" class="drawing">';
	} else {
		content 	= escapeHTML(content);
		content 	= linkify(content);
		content 	= emojify(content);
		content 	= memeify(content);
		content 	= webmify(content);
	}
  return content;
}
