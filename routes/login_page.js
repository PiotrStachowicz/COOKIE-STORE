let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let fs = require('fs')
let admin_username = 'gacek'
let admin_password = '1234'
const COOKIE_EXPIRATION_TIME = 2592000000 // 30 days in ms

async function check_if_user_exists(file, username){
  let buffer = await fs.promises.readFile(file)
  let buffer_array = buffer.toString().split(';')
  for(const element of buffer_array){
    let un = element.split(',')[0]
    if(un == username){
      return element.split(',')[1]
    }
  }
  return undefined
}

async function save_user_info(username, password){
  var hash_password = await bcrypt.hash(password, 12)
  await fs.promises.appendFile('server/database/logindata.txt', username + ',' + hash_password + ';')
}

router.get('/', function(req, res, next) {
  console.log(`get request on /login`)
  res.render('login', {message: '', message1: ''});
});

router.post('/', async function(req, res, next) {
  console.log(`post request on /login`)
  let username = req.body.username
  let password = req.body.password
  let type = req.query['type']
  
  if(type === 'login'){
    let psswrd = await check_if_user_exists('server/database/logindata.txt', username)
    if(username === admin_username && password === admin_password){
      if(req.signedCookies['admin'] == undefined){
        res.cookie("admin", username, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
      }
      if(req.signedCookies['cart'] != undefined){
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
  }else{
    if(await check_if_user_exists('server/database/logindata.txt', username) === undefined && username != 'gacek'){
      save_user_info(username, password)
      res.cookie("user", username, {signed: true})
      if(req.signedCookies['cart'] == undefined){
        res.cookie('cart', {cart: []}, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
      }
      res.cookie('admin', '', {maxAge: -1})
      res.redirect('/');
    }else{
      res.render('login', {message: '', message1: 'username already exists'});
    }
  }
});

module.exports = router;