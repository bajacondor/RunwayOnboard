var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:some?', function(req, res, next) {
  res.send(req.params.some).end();
 
});

module.exports = router;
