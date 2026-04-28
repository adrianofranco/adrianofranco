var fs = require('fs');
var path = require('path');

var SUPPORTED = ['en', 'pt-br'];
var DEFAULT_LANG = 'pt-br';
var COOKIE_NAME = 'lang';
var COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

var translations = {};
SUPPORTED.forEach(function (code) {
  var file = path.join(__dirname, '..', 'locales', code + '.json');
  translations[code] = JSON.parse(fs.readFileSync(file, 'utf-8'));
});

function detect(req) {
  var cookieLang = req.cookies && req.cookies[COOKIE_NAME];
  if (cookieLang && SUPPORTED.indexOf(cookieLang) !== -1) return cookieLang;

  var accept = (req.headers['accept-language'] || '').toLowerCase();
  if (accept.indexOf('en') === 0) return 'en';
  return DEFAULT_LANG;
}

function middleware(req, res, next) {
  var lang = detect(req);
  res.locals.lang = lang;
  res.locals.t = translations[lang];
  res.locals.supportedLangs = SUPPORTED;
  res.locals.translationsJSON = JSON.stringify(translations[lang]);
  next();
}

module.exports = {
  middleware: middleware,
  translations: translations,
  SUPPORTED: SUPPORTED,
  DEFAULT_LANG: DEFAULT_LANG,
  COOKIE_NAME: COOKIE_NAME,
  COOKIE_MAX_AGE: COOKIE_MAX_AGE,
  detect: detect
};
