const asciiArt =    " ░▒▓██████▓▒░░▒▓████████▓▒░▒▓████████▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░ \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░   \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
                    " ░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓████████▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░ \n" +
                    "                                                                                      \n" +
                    "                            PROVAVELMENTE SEU NAVEGADOR ESTÁ DESCONECTADO DA INTERNET";

const terminalHTML = `<div class="terminal"><span class="terminal-hint">type 'help' for available commands</span><div id="terminal-output" class="terminal-output"></div><div class="terminal-input-line"><span class="terminal-prompt">adriano@site:~$&nbsp;</span><span class="terminal-input" id="terminal-input" contenteditable="true" spellcheck="false" autocorrect="off" autocapitalize="off" role="textbox" aria-label="Terminal input"></span><span class="blink" id="terminal-cursor">_</span></div></div>`;

document.addEventListener('htmx:afterSwap', function (event) {

    if (event.detail.target.classList.contains('ascii-art')) {
        event.detail.target.innerHTML += terminalHTML;
    }

});

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

   setAsciiArt(asciiArtAlt + terminalHTML);

});

const setAsciiArt = (content) => {
    document.getElementsByClassName('ascii-art')[0].innerHTML = content;
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

