var config = {}

function createIcons(config) {
    var app_container = document.getElementById("app_container");
    console.log(Object.keys(config["EFB"]))
    for (i=0;i<Object.keys(config["EFB"]).length; i++) {
        if (Object.keys(config["EFB"])[i].substring(0,4) == "link") {
            console.log(config["EFB"][`link${i}`]["url"])
            if (config["EFB"][`link${i}`]["url"] != "") {
                console.log(`Adding: ${config["EFB"][`link${i}`]["label"]}`)
                const configURL = config["EFB"][`link${i}`]["url"]
                app_container.innerHTML += 
                `<div id="app_${i}" class="flex flex-col items-center max-h-[200px]">
                    <a class="rounded-md relative mb-5"  href="#">
                        <img class="rounded-3xl" width="150px" height="150px" src="https://static-cdn.jtvnw.net/jtv_user_pictures/ee875afa-3ace-4feb-8acc-95ba0e802d75-profile_image-300x300.png">
                        <div class="absolute bottom-0 left-0 right-0 rounded-3xl top-0 h-[150px] w-[150px] overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-30"></div>
                    </a>
                    <p class="text-3xl text-white">${config["EFB"][`link${i}`]["label"]}</p>
                </div>`;
                document.getElementById(`app_${i}`).addEventListener('click', (event) => {
                    console.log(i)
                    console.log(configURL)
                    changePage(configURL)
                })
            }
        }
    }
}

function changePage(url) {
    console.log("Changing page")
    var home_screen = document.getElementById("home_screen");
    var frame_browser = document.getElementById("frame_browser");
    var frame_container = document.getElementById("frame_container");

    frame_browser.src = `http://localhost:3000/fetch/${url}`;
    home_screen.classList.add("hidden")
    frame_container.classList.remove("hidden")
}

function initHTML() {

    fetch("http://localhost:3000/EFB/config", {method: 'GET', redirect: 'follow'})
        .then(response => response.text())
        .then(result => {
            console.log(result)
            config = JSON.parse(result)
            console.log(config)
            createIcons(config)

            
            var home_screen = document.getElementById("home_screen");
            var frame_container = document.getElementById("frame_container");
        
            frame_container.innerHTML = `<iframe id="frame_browser" src="https://google.com" title="EFB_Captain" style="width:${app_container.clientWidth}px; height:${app_container.clientHeight}px; border:0;"></iframe>`
        })
        .catch(error => console.log('error', error));
    // Determine number of links filled
    // for (i=1;i<)
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Page Fully Loaded")
    initHTML();

});


