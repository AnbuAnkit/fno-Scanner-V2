const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const net = require('net');

let mainWindow;
let nextServer;
let appUrl = 'http://127.0.0.1:3000';
const useDevServer = process.argv.includes('--dev-server');
const showDevTools = process.argv.includes('--debug-renderer');

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
    if (useDevServer || showDevTools) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
  });

  mainWindow.webContents.on('console-message', (_event, level, message, line, source) => {
    if (level === 3) {
      console.error(`Renderer error at ${source}:${line}: ${message}`);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(appUrl).catch((err) => {
    console.error('Failed to load the application:', err);
  });
}

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Unable to determine an available port for the Next.js server.'));
        return;
      }

      server.close((err) => {
        if (err) reject(err);
        else resolve(address.port);
      });
    });
  });
}

async function startNextServer() {
  const port = useDevServer ? 3000 : await getAvailablePort();
  appUrl = `http://127.0.0.1:${port}`;
  const nextAppPath = app.isPackaged
    ? path.join(process.resourcesPath, 'next')
    : path.join(__dirname, '..', '.next', 'standalone');
  if (!app.isPackaged) {
    const projectPath = path.join(__dirname, '..');
    fs.cpSync(path.join(projectPath, '.next', 'static'), path.join(nextAppPath, '.next', 'static'), {
      recursive: true,
    });
    fs.cpSync(path.join(projectPath, 'public'), path.join(nextAppPath, 'public'), {
      recursive: true,
    });
  }

  nextServer = spawn(process.execPath, [path.join(nextAppPath, 'server.js')], {
    cwd: nextAppPath,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
      HOSTNAME: '127.0.0.1',
      PORT: String(port),
    },
    stdio: 'inherit',
  });

  return nextServer;
}

function waitForNextServer(server) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      server.removeListener('error', onError);
      server.removeListener('exit', onExit);
      if (err) reject(err);
      else resolve();
    };

    const onError = (err) => {
      finish(new Error(`Failed to start the Next.js server: ${err.message}`));
    };
    const onExit = (code, signal) => {
      finish(new Error(`Next.js server exited before becoming ready (code ${code}, signal ${signal}).`));
    };
    const checkServer = () => {
      if (settled) return;
      const request = http.get(appUrl, (response) => {
        response.resume();
        finish();
      });
      request.setTimeout(1000, () => request.destroy());
      request.on('error', () => {
        if (!settled) setTimeout(checkServer, 250);
      });
    };
    const timeout = setTimeout(() => {
      finish(new Error('Timed out waiting for the Next.js server to become ready.'));
    }, 30000);

    server.once('error', onError);
    server.once('exit', onExit);
    checkServer();
  });
}

app.whenReady().then(async () => {
  if (!useDevServer) {
    try {
      await waitForNextServer(await startNextServer());
    } catch (err) {
      console.error(err);
      dialog.showErrorBox('Unable to start Fno Scanner', err.message);
      app.quit();
      return;
    }
  }

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
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