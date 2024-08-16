// document.getElementById('getStarted').addEventListener('click', () => {
//     console.log("Click!")
//     ipcRenderer.send('start-server');
//     document.getElementById('getStarted').innerHTML = 'Server Started';
// });

var max_links = 10;
var config = {};

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
    saveUserData();
});

config_home.addEventListener('click', () => {
    console.log("Home Config!")
    window.api.onLoadPage("start");
});


function initHTML() {
    for (let i = 0; i < max_links; i++) {
        document.getElementById("efb_settings_container").innerHTML += `
            <div id="efb_shortcut_${i+1}" class="configRow grid grid-cols-1">
                  <div id="link_row">
                    <p class="mt-1 float-left">Link ${i+1}</p> 
                    <a class="float-right rounded-md relative" id="clr_link_${i+1}">
                      <div class="flex items-center justify-center h-[37px] w-[37px] rounded-md bg-red-700 ml-1 align-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                      </div>
                      <div class="absolute bottom-0 left-0 right-0 rounded-md top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-30"></div>
                    </a>
                    <input type="text" name="link_${i+1}" id="link_${i+1}" class="block float-right w-3/5 rounded-md border-0 py-1.5 pl-5 pr-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Link ${i+1}">
                    
                  </div>
                  <div id="icon_row" class="mt-2">
                    <div class="float-left pl-5 mt-[9px] relative">
                        <p class="mt-1 float-left">Appearance</p> 
                    </div>
                    <div class="float-right mt-[9px] relative">
                        <p class="float-left"></p>
                        <a class="float-right rounded-md relative" id="clr_img_${i+1}">
                        <div class="flex items-center justify-center h-[37px] w-[37px] rounded-md bg-red-700 ml-1 align-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 rounded-md top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-30"></div>
                        </a>
                        <a class="float-right rounded-md relative">
                        <img class="rounded-md" width="37px" height="37px" src="https://static-cdn.jtvnw.net/jtv_user_pictures/ee875afa-3ace-4feb-8acc-95ba0e802d75-profile_image-300x300.png">
                        <div class="absolute bottom-0 left-0 right-0 rounded-md top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-30"></div>
                        </a>
                        <a class="float-right rounded-md relative mr-1" id="clr_label_${i+1}">
                        <div class="flex items-center justify-center h-[37px] w-[37px] rounded-md bg-red-700 ml-1 align-center">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 rounded-md top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-30"></div>
                        </a>
                        <input type="text" name="label_${i+1}" id="label_${i+1}" class="block float-right w-3/5 rounded-md border-0 py-1.5 pl-5 pr-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Label">
                    
                    </div>
                    
                  </div>
                </div>`;  
    }

}

function saveUserData() {
    for (i=0; i<max_links; i++) {
        linkBox = document.getElementById(`link_${i+1}`)
        labelBox = document.getElementById(`label_${i+1}`)
        config["EFB"][`link${i+1}`]["url"] = linkBox.value;
        config["EFB"][`link${i+1}`]["label"] = labelBox.value;
    }
    window.api.saveUserData(config);
}

initHTML();

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Page Fully Loaded")

    window.api.requestSavedData();

    pageData = {};

    const serverToggle = document.getElementById('serverToggle');
    if (serverToggle) {
        serverToggle.addEventListener('click', () => {
            console.log("Click!");
            window.api.requestServerStatus(); // Request server status from main process
            if (Array.from(serverToggle.innerHTML)[0] == "🔴") {
                console.log("Sending Start Request")
                window.api.requestServerToggle(1);
            } else {
                console.log("Sending Kill Request")
                window.api.requestServerToggle(0);
            }
        });
    } else {
        console.error('serverToggle element not found');
    }
    
    for (i = 0; i<max_links; i++) {
        
        document.getElementById(`clr_link_${i+1}`).addEventListener('click', () => {
            document.getElementById(`link_${i+1}`).value = "";
        })
        document.getElementById(`clr_label_${i+1}`).addEventListener('click', () => {
            document.getElementById(`label_${i+1}`).value = "";
        })
    }


    window.api.onReceiveServerStatus((status) => {
        if (status) {
            document.getElementById('serverToggle').innerHTML = "🟢 Server Running"
        } else {
            document.getElementById('serverToggle').innerHTML = "🔴 Server Stopped"
        }
    })

    window.api.onReceiveSavedData((data) => {
        config = data;
        for (const [key, value] of Object.entries(data["EFB"])) {
            if (key != "style") {
                i = key.slice(4)
                console.log(`Putting ${value["label"]} in Link ${i}`)
                element = document.getElementById(`efb_shortcut_${i}`);
                linkBox = document.getElementById(`link_${i}`);
                labelBox = document.getElementById(`label_${i}`);

                if (value["url"]) {linkBox.value = value["url"];
                    } else { linkBox.value = "";}
                if (value["label"]) {labelBox.value = value["label"];
                    } else { labelBox.value = "";}
            }
        }
        pageData = data;
    })
});


