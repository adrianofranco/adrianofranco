var express = require('express');
var router = express.Router();

const profile = {
  name: "Adriano Franco"
}

/* GET win31 page. */
router.get('/', function(req, res, next) {
  profile.is404 = false;
  res.render('win31', { profile });
});

router.use((req, res, next) => {
  profile.is404 = true;
  res.status(404).render('win31', { profile });
});

module.exports = router;
