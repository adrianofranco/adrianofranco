document.addEventListener('htmx:responseError', function (event) {

    var target = event.detail.target;

    if (!target.dataset.retry) {

        target.dataset.retry = true;

        var altenativeUrl = '/ascii-art/offline.txt';

        htmx.ajax('GET', altenativeUrl, { target: target });
    } else {
        target.innerHTML = 'Error: no data';
    }
});

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

