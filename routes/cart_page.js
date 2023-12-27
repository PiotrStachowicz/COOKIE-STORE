let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  console.log(`get request on /cart`)
  let array = []
  if(req.signedCookies['cart'] != undefined){
    array = req.signedCookies['cart'].cart
    console.log(array)
  }
  res.render('cart', {products: array})
});

module.exports = router;