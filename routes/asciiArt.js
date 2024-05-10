var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
const { error } = require('console');

var router = express.Router();

express().use(cookieParser())

const advises = {
  textAdvise: '',
  textEnough: ''
}


const setAdvises = () => {
  advises.textAdvise = ' TRY TO REFRESH THE PAGE... _';
  advises.textEnough = ' OK, IT\'S SEEMS TO BE ENOUGH _';
}



const oneWeek = 7 * 24 * 60 * 60 * 1000;

this.storedRefresh = 0;
this.storedDate = 0;


const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateAscii(is404 = false, res) {

  setAdvises();

  this.storedRefresh++;

  res.cookie('refreshes', this.storedRefresh, { maxAge: oneWeek });

  let art = rand(1, 3);

  if(is404){
    art =  'zebra'
    errorNotFound = '<h2 class="error-message"> Solicitação não encontrada <span class="blink">_</span></h2>';
    advises.textAdvise = errorNotFound;
    advises.textEnough = errorNotFound;
  } 

  const filePath = path.join(__dirname, `../ascii-art/${art}.txt`);

  let randomStrings = fs.readFileSync(filePath, 'utf-8').trim();

  advise = this.storedRefresh > 3 ? advises.textEnough : advises.textAdvise;

  randomStrings = randomStrings.slice(0, (advise.length - (advise.length * 2))) + advise;

  let asciiArt = Array.from(randomStrings).map(ascii => `${ascii}`).join('');

  return asciiArt;

}

/* GET users listing. */
router.get('/:is404?', function (req, res, next) {

  const is404 = req.params.is404 ? true : false;

  const now = new Date();

  const storedDateCookie = req.cookies.date;
  const storedRefreshCookie = req.cookies.refreshes;

  this.storedDate = storedDateCookie ? new Date(parseInt(storedDateCookie)) : null;
  this.storedRefresh = storedRefreshCookie || null;


  if (this.storedRefresh == null) {
    console.log('entrou');
    res.cookie('refreshes', 0, { maxAge: oneWeek });
    this.storedRefresh = 0;
  }

  if (this.storedDate && now.getTime() - this.storedDate.getTime() > oneWeek) {
    // Clear all cookies by setting them to expire immediately
    res.clearCookie('date');
    res.clearCookie('refreshes');
    // Reset the date cookie to current date
    res.cookie('date', now.getTime().toString(), { maxAge: oneWeek });
  }

  res.send(generateAscii(is404, res));

});

module.exports = router;
