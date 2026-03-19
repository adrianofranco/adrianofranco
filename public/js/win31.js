// Windows 3.11 - Client-side interactions

// ASCII art fallback for offline mode
const asciiArt =
    " ░▒▓██████▓▒░░▒▓████████▓▒░▒▓████████▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░ \n" +
    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
    "░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░ ░▒▓██████▓▒░ ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░   \n" +
    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
    "░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        \n" +
    " ░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓████████▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░ \n" +
    "                                                                                      \n" +
    "                            PROVAVELMENTE SEU NAVEGADOR ESTÁ DESCONECTADO DA INTERNET";

// Draggable windows
function initDraggable() {
    const titleBars = document.querySelectorAll('[data-draggable="true"]');

    titleBars.forEach(titleBar => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        const win = titleBar.closest('.window');

        // Bring window to front on click
        titleBar.addEventListener('mousedown', (e) => {
            bringToFront(win);
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            win.style.left = (e.clientX - offsetX) + 'px';
            win.style.top = (e.clientY - offsetY) + 'px';
            win.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch support
        titleBar.addEventListener('touchstart', (e) => {
            bringToFront(win);
            isDragging = true;
            const touch = e.touches[0];
            offsetX = touch.clientX - win.offsetLeft;
            offsetY = touch.clientY - win.offsetTop;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touch = e.touches[0];
            win.style.left = (touch.clientX - offsetX) + 'px';
            win.style.top = (touch.clientY - offsetY) + 'px';
            win.style.transform = 'none';
        }, { passive: true });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    });
}

// Z-index management
let topZ = 20;

function bringToFront(win) {
    topZ++;
    win.style.zIndex = topZ;
}

// Click on window body also brings to front
document.addEventListener('mousedown', (e) => {
    const win = e.target.closest('.window');
    if (win) bringToFront(win);
});

// Menu "Help > About" click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-item') && e.target.textContent.includes('Help')) {
        const aboutDialog = document.getElementById('about-dialog');
        if (aboutDialog) {
            aboutDialog.style.display = 'flex';
            bringToFront(aboutDialog);
        }
    }
});

// HTMX error handling (offline)
document.addEventListener('htmx:sendError', function (event) {
    var target = event.detail.target;
    target.innerHTML = asciiArt;
});

// Online/Offline detection
window.addEventListener('offline', () => {
    setAsciiArt(asciiArt);
});

window.addEventListener('online', async () => {
    const asciiArtAlt = await fetch('/ascii-art').then(function (response) {
        return response.text();
    });
    setAsciiArt(asciiArtAlt);
});

const setAsciiArt = (art) => {
    const el = document.getElementsByClassName('ascii-art')[0];
    if (el) el.innerHTML = art;
};

// Service Worker registration
const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/offline.js", { scope: '/' });

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

// Init
document.addEventListener('DOMContentLoaded', () => {
    initDraggable();
    registerServiceWorker();
});
