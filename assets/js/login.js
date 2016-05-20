const ipcRenderer = require('electron').ipcRenderer;

$('#login').submit(function() {
  ipcRenderer.send('logging-in', 'myUsername');
});
