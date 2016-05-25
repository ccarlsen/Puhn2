exports.chatInputFocus = function() {
	$('#send').focus();
}

exports.timeAgo = function() {
	$('time').timeago();
}

exports.scrollToBottom = function() {
	$('#chat').animate({scrollTop: $('#chat').prop('scrollHeight')}, 200);
}


