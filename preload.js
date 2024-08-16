const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onReceiveServerStatus: (callback) => {
      console.log('Setting up onReceiveServerStatus');
      ipcRenderer.on('receive-server-status', (event, status) => {
          console.log('receive-server-status event received with status:', status);
          callback(status);
      });
  },
  requestServerStatus: () => {
      console.log("Requesting server status");
      ipcRenderer.send('rq-server-status');
  },
  saveUserData: (data) => {
    console.log("Sending userData to save", JSON.stringify(data));
    ipcRenderer.send('save-userdata', data)
  },
  requestServerToggle: (onoroff) => {
      console.log("Request Server Toggle");
      ipcRenderer.send('toggle-server', onoroff)
  },
  onLoadPage: (page) => {
      console.log("Sending nav-to with page:", page);
      ipcRenderer.send('nav-to', page);
  },
  requestSavedData: () => {
    console.log("Requesting saved userData");
    ipcRenderer.send('rq-saved-userdata')
  },
  onReceiveSavedData: (callback) => {
    ipcRenderer.on('receive-saved-userdata', (event, data) => {
      console.log('receive-saved-userdata event received with userdata:', data)
      callback(data);
    })
  }
});
