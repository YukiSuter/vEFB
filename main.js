const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

const pages = {
    "start": 'electron/html/start.html',
    "main": 'electron/html/main.html'
}

var info = {}

fs.readFile('info.json', (err, data) => {
    info = JSON.parse(data);
})

const userDataFolder = app.getPath('userData')
var config = {}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
    })

    mainWindow.loadFile(pages["start"])
    mainWindow.setMenu(null)
    mainWindow.setResizable(false)
    mainWindow.webContents.openDevTools()

    // Find existing config file or create new based on template



    
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// function to search for userData and populate with template if empty
function loadUserData() {
    console.log("Loading userdata")
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(userDataFolder, 'userConfig.json'), (err, data) => {
            if (!err && data) {
                rawJSON = data.toString();
                config = JSON.parse(rawJSON);
                console.log("Successfully loaded userData.json")
                resolve(config);
            } else if (err.code == 'ENOENT') { // file not found
                data = JSON.stringify(info["settings-template"]);
                console.log(`Default Template: ${data}`);
                fs.writeFile(path.join(userDataFolder, 'userConfig.json'), data, 
                    {
                        encoding: "utf8",
                        flag: "w",
                        mode: 0o666
                    },
                    
                    (err) => {
                        if (err)
                        console.log(err);
                        else {
                        console.log("File written successfully\n");
                        console.log("The written has the following contents:");
                        console.log(fs.readFileSync(path.join(userDataFolder, 'userConfig.json'), "utf8"));
                        }
                    }
                );
                resolve(data);
            }
            resolve("That didnt work");
        })
    })
}

function writeUserData() 
    {fs.writeFile(path.join(userDataFolder, 'userConfig.json'), JSON.stringify(config), 
        {
            encoding: "utf8",
            flag: "w",
            mode: 0o666
        },
        
        (err) => {
            if (err)
            console.log(err);
            else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            console.log(fs.readFileSync(path.join(userDataFolder, 'userConfig.json'), "utf8"));
            }
        }
    );
}

function sendServerStatus() {
    console.log('Sending server status to electron');
    if (serverProcess) {
        mainWindow.webContents.send('receive-server-status', 1)
    } else {
        mainWindow.webContents.send('receive-server-status', 0)
    }
}

function sendUserData() {
    console.log('Sending userData');
    loadUserData().then((data) => {
        console.log(data);
        mainWindow.webContents.send('receive-saved-userdata', data);
    })
    
}

function refreshServerData() {
    if (serverProcess) {
        console.log("Triggering server refresh")
        data_json = JSON.stringify({"data":["refresh-server-data", [config]]});
        serverProcess.stdin.write(`${data_json}\n`);
    }
}

  
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

ipcMain.on('toggle-server', (event, onoroff) => {
    console.log(`onoroff: ${onoroff.toString()}`)
    if (!serverProcess && onoroff) {
        console.log("Starting Server")
        serverProcess = spawn('node', [path.join(__dirname, 'server.js')]);
        console.log("Server Started")
        sendServerStatus();

        serverProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            if (data.slice(0,17).toString() == "Server is running") {
                console.log("Triggerring initial")
                refreshServerData();
            }
        });

        serverProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        });

        serverProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        serverProcess = null;
        sendServerStatus();
        refreshServerData()
        });
    } else if (serverProcess && !onoroff) {
        console.log("Stopping Server")
        serverProcess.kill('SIGINT');
        sendServerStatus();
    }
});

ipcMain.on('nav-to', (event, arg) => {
    console.log("Changing page")
    mainWindow.loadFile(pages[arg]);
});

ipcMain.on('rq-server-status', (event) => {
    sendServerStatus();
});

ipcMain.on('rq-saved-userdata', (event) => {
    console.log("Received userdata request")
    sendUserData();
})

ipcMain.on('save-userdata', (event, data) => {
    console.log(`Received new userData: ${JSON.stringify(data)}`)
    config = data;
    refreshServerData();
    writeUserData();
})