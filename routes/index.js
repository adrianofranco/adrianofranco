var express = require('express');
var router = express.Router();

const profile = {
  name: "Adriano Franco"
} 

/* GET home page. */
router.get('/', function(req, res, next) {
  profile.is404 = false;
  res.render('index', { profile });
});

router.get('/index.html', function(req, res, next) {
  profile.is404 = false;
  res.render('index', { profile });
});

router.use((req, res, next) => {
  profile.is404 = true;
  res.status(404).render('index', { profile });
});


module.exports = router;
