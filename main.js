const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('ready', function() {
  var screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width;
  var screenHeight = electron.screen.getPrimaryDisplay().workAreaSize.height;
  if (process.platform == 'darwin') {
    mainWindow = new BrowserWindow({width: screenWidth, height: screenHeight, frame: false});
  } else {
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false});
  }
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  //mainWindow.webContents.openDevTools();
});