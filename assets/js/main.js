let textAdvise = ' TRY TO REFRESH THE PAGE... _';
let textEnough = ' OK, IT\'S SEEMS TO BE ENOUGH _';

const oneWeek = 7 * 24 * 60 * 60 * 1000;
const now = new Date();

let storedDate = localStorage.getItem('date') != null ? new Date(parseInt(localStorage.getItem('date'))) : null;

if (storedDate == null) localStorage.setItem('date', now.getTime().toString());

let storedRefresh = localStorage.getItem('refreshes') != null ? localStorage.getItem('refreshes') : null;

if (storedRefresh == null) {
    console.log('entrou');
    localStorage.setItem('refreshes', 0);
    storedRefresh = localStorage.getItem('refreshes');
}

if (storedDate && now.getTime() - storedDate.getTime() > oneWeek) {
    localStorage.clear();
    localStorage.setItem('date', now.getTime().toString());
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

fetch(`ascii-art/${rand(1, 3)}.txt`).then(response => response.text()).then(data => {

    storedRefresh++;

    localStorage.setItem('refreshes', storedRefresh);

    advise = storedRefresh > 3 ? textEnough : textAdvise;

    data = data.slice(0, (advise.length - (advise.length * 2))) + advise;

    let asciiArt = Array.from(data).map(ascii => `<span>${ascii}</span>`).join('');

    const asciiArtElement = document.querySelector('.ascii-art');
    asciiArtElement.innerHTML = asciiArt;
    asciiArtElement.lastElementChild.classList.add('blink');
});
