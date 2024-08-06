const { ipcRenderer } = require('electron');

// document.getElementById('getStarted').addEventListener('click', () => {
//     console.log("Click!")
//     ipcRenderer.send('start-server');
//     document.getElementById('getStarted').innerHTML = 'Server Started';
// });

document.getElementById('getStarted').addEventListener('click', () => {
    console.log("Click!")
    ipcRenderer.send('nav-to', "main");
    document.getElementById('getStarted').innerHTML = 'Server Started';
});