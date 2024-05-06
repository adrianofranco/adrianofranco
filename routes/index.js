var express = require('express');
var router = express.Router();

const profileName = "Adriano Franco"


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', profileName });
});

module.exports = router;
