const ipcRenderer = require('electron').ipcRenderer;
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
      var errorText = 'Unexpected error';
      switch(fail.status) {
        case 401:
          errorText = 'Login incorrct.'
          break;
        case 404:
          errorText = '404 not found.'
          break;
        case 0:
          errorText = 'Server offline.'
          break;
        }
      $('#error').html(errorText);
  });
});
