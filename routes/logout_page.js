let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  console.log(`get request on /logout`)
  if(req.signedCookies['admin']){
    res.cookie('admin', '', {maxAge: -1})
    
  }
  if(req.signedCookies['user']){
    res.cookie('user', '', {maxAge: -1})
  }
  res.cookie('cart', {}, {maxAge: -1})
  res.redirect('/');
});

module.exports = router;