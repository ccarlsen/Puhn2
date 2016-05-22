const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

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
    mainWindow.webContents.openDevTools();
  });
});
