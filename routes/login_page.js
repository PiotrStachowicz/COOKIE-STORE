let express = require('express');
let router = express.Router();
//let authorize = require('authorize') WTD
let admin_username = 'gacek'
let admin_password = '1234'

router.get('/', function(req, res, next) {
  console.log(`get request on /login`)
  res.render('login', {message: ""});
});

router.post('/', function(req, res, next) {
  console.log(`post request on /login`)
  username = req.body.username
  password = req.body.password
  type = req.query['type']
  if(type === 'login'){
    if(username === admin_username && password === admin_password){
      res.cookie("admin", username, {signed: true, maxAge: 50000})
      res.redirect('/');
    }else{
      res.render('login', {message: "incorrect username or password"});
    }
  }else{
    res.cookie("user", username, {signed: true})
    res.redirect('/');
  }
});

module.exports = router;