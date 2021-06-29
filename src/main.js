const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

if (process.platform === "linux") {
  app.commandLine.appendSwitch("enable-experimental-web-platform-features", true);
} else {
  app.commandLine.appendSwitch("enable-web-bluetooth", true);
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
	icon: path.join(__dirname, "resources/icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, 'main-preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    const mainContent = mainWindow.webContents;
    let deviceChosenCallback;

    mainContent.on('select-bluetooth-device', (event, deviceList, callback) => {
      event.preventDefault();
      deviceChosenCallback = callback;
      mainContent.send('devices-found', deviceList);
    });

    ipcMain.once('select-device', (_, deviceId) => {
      deviceChosenCallback(deviceId);
    });

    mainContent.executeJavaScript('document.getElementById("gesture-workaround").click();', true);
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})