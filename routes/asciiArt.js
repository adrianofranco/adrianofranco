var express = require('express');
var fs = require('fs');
var path = require('path');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var router = express.Router();


let textAdvise = ' TRY TO REFRESH THE PAGE... _';
//let textEnough = ' OK, IT\'S SEEMS TO BE ENOUGH _';
let textEnough = ' TRY TO REFRESH THE PAGE... _';

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


const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateAscii() {

  const filePath = path.join(__dirname, `../ascii-art/${rand(1, 3)}.txt`);

  let randomStrings = fs.readFileSync(filePath, 'utf-8').trim();
  
  storedRefresh++;

    localStorage.setItem('refreshes', storedRefresh);

    advise = storedRefresh > 3 ? textEnough : textAdvise;

    randomStrings = randomStrings.slice(0, (advise.length - (advise.length * 2))) + advise;
  
  let asciiArt = Array.from(randomStrings).map(ascii => `<span>${ascii}</span>`).join('');

  return asciiArt;

}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(generateAscii());
});

module.exports = router;
