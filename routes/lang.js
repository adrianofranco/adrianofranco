var express = require('express');
var i18n = require('../lib/i18n');

var router = express.Router();

router.post('/:code', function (req, res) {
  var code = (req.params.code || '').toLowerCase();
  if (i18n.SUPPORTED.indexOf(code) === -1) {
    return res.status(400).json({ ok: false, error: 'unsupported', supported: i18n.SUPPORTED });
  }
  res.cookie(i18n.COOKIE_NAME, code, { maxAge: i18n.COOKIE_MAX_AGE, sameSite: 'lax' });
  res.json({ ok: true, lang: code });
});

module.exports = router;
