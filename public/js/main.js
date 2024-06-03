
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/public/js/offline.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}


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


