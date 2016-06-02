const electron			= require('electron');
const {Menu, MenuItem, app, BrowserWindow, ipcMain} = electron;

let loginWindow;
let mainWindow;

app.on('ready', function() {

	loginWindow = new BrowserWindow({width: 300, height: 340, frame: false});
	loginWindow.loadURL(`file://${__dirname}/login.html`);

	ipcMain.on('logging-in', (event, arg) => {
		var screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width;
		var screenHeight = electron.screen.getPrimaryDisplay().workAreaSize.height;

		if (process.platform == 'darwin') {
			mainWindow = new BrowserWindow({width: screenWidth, height: screenHeight, frame: false});
		} else {
			mainWindow = new BrowserWindow({width: 1280, height: 768, frame: false});
		}

		mainWindow.token = arg.token;
		mainWindow.myUsername = arg.username;

		mainWindow.loadURL(`file://${__dirname}/index.html`);
		loginWindow.close();
		//mainWindow.webContents.openDevTools();

		var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

	});
});

app.on('window-all-closed', function() {
  app.quit();
});
