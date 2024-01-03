let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let database = require('../public/javascript/dataquery')

const COOKIE_EXPIRATION_TIME = 2592000000 // 30 days in ms

async function check_if_user_exists(username){
  var result = await database.get_userdata('NAME', username, 'PSSWRD')
  if(result[0] === undefined){
    return undefined
  }else{
    return result[0].PSSWRD
  }
}

router.get('/', function(req, res, next) {
  console.log(`get request on /login`)
  res.render('login', {message: '', message1: ''});
});

router.post('/', async function(req, res, next) {
  console.log(`post request on /login`)
  let username = req.body.username
  let password = req.body.password
  let psswrd = await check_if_user_exists(username)

  if(username === 'Admin' && await bcrypt.compare(password, psswrd)){

    if(req.signedCookies['admin'] == undefined){
      res.cookie("admin", username, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
    }
    if(req.signedCookies['cart'] == undefined){
      res.cookie('cart', {cart: []}, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
    }
    
    res.cookie('user', '', {maxAge: -1})
    res.redirect('/')
  }else if(psswrd !== undefined && await bcrypt.compare(password, psswrd)){
    if(req.signedCookies['user'] == undefined){
      res.cookie("user", username, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
    }
    if(req.signedCookies['cart'] == undefined){
      res.cookie('cart', {cart: []}, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
    }
    res.cookie('admin', '', {maxAge: -1})
    res.redirect('/');
  }else{
    res.render('login', {message: 'incorrect username or password', message1: ''});
  }
});

module.exports = router;