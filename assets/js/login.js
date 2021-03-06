const {ipcRenderer}	= require('electron');
var io				= require('socket.io-client');
var config			= require('./config.js');

// Get username/password from localStorage
var localUsername = localStorage.getItem('localUsername');
var localPassword = localStorage.getItem('localPassword');
if (localUsername == null || localPassword == null) {
	$('#loginUsername').focus();
} else {
	$('#loginUsername').val(localUsername);
	$('#loginPassword').val(localPassword);
}

// Focus on input when ready
$(document).on('ready', function() {
	$('#loginUsername').focus();
});

// Login form submit
$('#login').submit(function(event) {
	event.preventDefault();

	var loginUsername = $('#loginUsername').val();
	var loginPassword = $('#loginPassword').val();

	// Set username/password in localStorage
	localStorage.setItem('localUsername', loginUsername);
	localStorage.setItem('localPassword', loginPassword);

	$('#login button').attr('disabled', true);
	$('#login button').text('Logging in...');

	$.post(config.http.url + '/login', {
		username: loginUsername,
		password: loginPassword
	}).done(function (result) {
		ipcRenderer.send('logging-in', {token: result.token, username: loginUsername});
	}).fail(function(fail) {
		$('#login button').attr('disabled', false);
		$('#login button').text('Log in');
		var errorText = 'Something is fucked!';
		switch(fail.status) {
			case 401:
				errorText = 'Wrong login info, idiot!'
				break;
			case 404:
				errorText = '404 error, motherfucker!'
				break;
			case 0:
				errorText = 'The server is fucked up!'
			break;
		}
		alert(errorText);
	});
});
