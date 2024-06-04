const asciiArt =    " ░▒▓██████▓▒░░▒▓████████▓▒░▒▓████████▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░ \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░   \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    " ░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓████████▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░ \n" +
                    "                                                                                      \n" +
                    "                            PROVAVELMENTE SEU NAVEGADOR ESTÁ DESCONECTADO DA INTERNET";

document.addEventListener('htmx:sendError', function (event) {

    var target = event.detail.target;

    target.innerHTML = asciiArt;

});

console.log('Initially ' + (window.navigator.onLine ? 'online' : 'offline'));

window.addEventListener('offline', () => {

    setAsciiArt(asciiArt);

});

window.addEventListener('online', async () => {
   const asciiArtAlt = await fetch('/ascii-art').then(function(response){
    return response.text();
   });

   setAsciiArt(asciiArtAlt);

});

const setAsciiArt = (asciiArt) => {
    document.getElementsByClassName('ascii-art')[0].innerHTML = asciiArt;
}

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("offline.js", { scope: '/'});
            
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

registerServiceWorker();

