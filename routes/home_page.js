let express = require('express');
let router = express.Router();
//let authorize = require('authorize') WTD

router.get('/', function(req, res, next) {
  console.log(`get request on /`)
  let username = ""
  if(req.signedCookies.admin){
    username = req.signedCookies.admin
  }else if(req.signedCookies.user){
    username = req.signedCookies.user
  }
  console.log(username)
  res.render('home', { username: username });
});

router.post('/', function(req, res, next) {
  console.log(`post request on /`)
  let username = ""
  if(req.signedCookies.admin){
    username = req.signedCookies.admin
  }else if(req.signedCookies.user){
    username = req.signedCookies.user
  }
  console.log(username)
  res.render('home', { username: username });
});

module.exports = router;