let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  console.log(`get request on /cart`)
  res.render('cart')
});

module.exports = router;