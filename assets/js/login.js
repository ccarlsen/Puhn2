const ipcRenderer = require('electron').ipcRenderer;
var win = require('electron').remote.getCurrentWindow();
var io = require('socket.io-client');
var config = require('./config.js');

$('#login').submit(function(e) {
  e.preventDefault();
    var loginUsername = $('#loginUsername').val();
    var loginPassword = $('#loginPassword').val();
    $.post(config.http.url + '/login', {
      username: loginUsername,
      password: loginPassword
    }).done(function (result) {
      ipcRenderer.send('logging-in', {token: result.token, username: loginUsername});
    }).fail(function(fail){
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