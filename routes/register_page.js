let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
// THIS ALSO
let fs = require('fs')
let admin_username = 'gacek'
let admin_password = '1234'

const COOKIE_EXPIRATION_TIME = 2592000000 // 30 days in ms


// CHANGE FROM TXT TO DATABASE
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

// CHANGE FROM TXT TO DATABASE
async function save_user_info(username, password){
  var hash_password = await bcrypt.hash(password, 12)
  await fs.promises.appendFile('server/database/logindata.txt', username + ',' + hash_password + ';')
}

router.get('/', function(req, res, next) {
  console.log(`get request on /login`)
  res.render('register', {message: '', message1: ''});
});

router.post('/', async function(req, res, next) {
  console.log(`post request on /login`)
  let username = req.body.username
  let password = req.body.password
  if(await check_if_user_exists('server/database/logindata.txt', username) === undefined && username != 'gacek'){
    save_user_info(username, password)
    res.cookie("user", username, {signed: true})
    if(req.signedCookies['cart'] == undefined){
        res.cookie('cart', {cart: []}, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
    }
    res.cookie('admin', '', {maxAge: -1})
    res.redirect('/');
    }else{
        res.render('register', {message: '', message1: 'username already exists'});
    }
});

module.exports = router;