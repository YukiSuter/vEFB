const { ipcRenderer } = require('electron');

// document.getElementById('getStarted').addEventListener('click', () => {
//     console.log("Click!")
//     ipcRenderer.send('start-server');
//     document.getElementById('getStarted').innerHTML = 'Server Started';
// });

config_efb_cont = document.getElementById('config_efb_cont')
config_aircraft_cont = document.getElementById('config_aircraft_cont')
config_settings_cont = document.getElementById('config_settings_cont')
config_save_cont = document.getElementById('config_save_cont')

config_spacer = document.getElementById('config_spacer')

config_efb = document.getElementById('config_efb')
config_aircraft = document.getElementById('config_aircraft')
config_settings = document.getElementById('config_settings')
config_save = document.getElementById('config_save')

config_home = document.getElementById('config_home')

config_efb.addEventListener('click', () => {
    console.log("EFB Config!")

    config_efb_cont.className = 'flex-none mt-1 h-10'
    config_aircraft_cont.className = 'flex-none mt-1 bg-slate-700 rounded-tl-md border-l border-t border-slate-600 h-10'
    config_settings_cont.className = 'float-right flex-none mt-1 bg-slate-700 border-t border-slate-600 h-10'
    config_save_cont.className = 'float-right flex-none mt-1 bg-slate-700 border-t border-slate-600 h-10'
    
    config_spacer.className = 'grow bg-slate-700 border-solid border border-slate-600 mt-1 h-10'

    config_efb.className = 'text-xl text-sky-300 py-1 px-5 border-b-2 border-sky-300 h-full'
    config_aircraft.className = 'text-xl text-gray-400 py-1 px-5 border-b border-slate-600 h-full'
    config_settings.className = 'text-xl text-gray-400 py-1 px-5 border-b border-slate-600 h-full'
});

config_aircraft.addEventListener('click', () => {
    console.log("aircraft Config!")

    config_aircraft_cont.className = 'flex-none mt-1 h-10'
    config_efb_cont.className = 'flex-none mt-1 bg-slate-700 rounded-tr-md border-l border-t border-slate-600 h-10'
    config_settings_cont.className = 'float-right flex-none mt-1 bg-slate-700 border-t border-slate-600 h-10'
    config_save_cont.className = 'float-right flex-none mt-1 bg-slate-700 border-t border-slate-600 h-10'
    
    config_spacer.className = 'grow bg-slate-700 border-solid rounded-tl-md border border-slate-600 mt-1 h-10'

    config_aircraft.className = 'text-xl text-sky-300 py-1 px-5 border-b-2 border-sky-300 h-full'
    config_efb.className = 'text-xl text-gray-400 py-1 px-5 border-b border-slate-600 h-full'
    config_settings.className = 'text-xl text-gray-400 py-1 px-5 border-b border-slate-600 h-full'
});

config_settings.addEventListener('click', () => {
    console.log("settings Config!")

    config_settings_cont.className = 'flex-none mt-1 h-10'
    config_aircraft_cont.className = 'flex-none mt-1 bg-slate-700 border-l border-t border-slate-600 h-10'
    config_efb_cont.className = 'float-right flex-none mt-1 bg-slate-700 border-t border-slate-600 h-10'
    config_save_cont.className = 'float-right flex-none mt-1 bg-slate-700 rounded-tl-md border-t border-slate-600 h-10'
    
    config_spacer.className = 'grow bg-slate-700 border-solid rounded-tr-md border border-slate-600 mt-1 h-10'

    config_settings.className = 'text-xl text-sky-300 py-1 px-5 border-b-2 border-sky-300 h-full'
    config_aircraft.className = 'text-xl text-gray-400 py-1 px-5 border-b border-slate-600 h-full'
    config_efb.className = 'text-xl text-gray-400 py-1 px-5 border-b border-slate-600 h-full'
});

config_save.addEventListener('click', () => {
    console.log("save Config!")

});

config_home.addEventListener('click', () => {
    console.log("Home Config!")
    ipcRenderer.send('nav-to', "start");
});