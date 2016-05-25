var win = require('electron').remote.getCurrentWindow();

$('#actions .close').on('click', function() {
	win.close();
});

$('#actions .maximize').on('click', function() {
	win.maximize();
});

$('#actions .minimize').on('click', function() {
	win.minimize();
});