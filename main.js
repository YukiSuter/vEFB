const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

const pages = {
    "start": 'electron/html/start.html',
    "main": 'electron/html/main.html'
}

var settings = {
    "EFB": {
        "style": "A",
        "link1": "https://google.co.uk",
        "link2": "https://google.co.uk",
        "link3": "https://google.co.uk",
        "link4": "https://google.co.uk",
        "link5": "https://google.co.uk",
        "link6": "https://google.co.uk",
        "link7": "https://google.co.uk",
        "link8": "https://google.co.uk",
        "link9": "https://google.co.uk",
        "link10": "https://google.co.uk",
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    mainWindow.loadFile(pages["start"])
    mainWindow.setMenu(null)
    mainWindow.setResizable(false)
    mainWindow.webContents.openDevTools()

    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

  
app.on('ready', () => {
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

ipcMain.on('start-server', () => {
    console.log("Starting Server")
    if (!serverProcess) {
        serverProcess = spawn('node', [path.join(__dirname, 'server.js')]);
        console.log("Server Started")

        serverProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        });

        serverProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        });

        serverProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        serverProcess = null;
        });
    }
});

ipcMain.on('nav-to', (event, arg) => {
    console.log("Changing page")
    mainWindow.loadFile(pages[arg]);
});