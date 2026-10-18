const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let nextServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'default',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../.next/standalone/index.html'));
  }
}

function startNextServer() {
  if (isDev) return;

  const serverPath = path.join(__dirname, '../.next/standalone/server.js');
  nextServer = spawn('node', [serverPath], {
    env: { ...process.env, PORT: '3000' },
    stdio: 'inherit',
  });

  nextServer.on('error', (err) => {
    console.error('Failed to start Next.js server:', err);
  });
}

app.whenReady().then(() => {
  startNextServer();
  
  setTimeout(() => {
    createWindow();
  }, isDev ? 0 : 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (nextServer) {
    nextServer.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (nextServer) {
    nextServer.kill();
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});