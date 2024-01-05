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

async function save_user_info(username, password){
  var hash_password = await bcrypt.hash(password, 12)
  await database.set_userdata({name: username, psswrd: hash_password})
}

router.get('/', function(req, res, next) {
  console.log(`get request on /register`)
  res.render('register', {message: '', message1: ''});
});

router.post('/', async function(req, res, next) {
  console.log(`post request on /register`)
  let username = req.body.username
  let password = req.body.password
  if(await check_if_user_exists(username) === undefined && username != 'Admin'){
    await save_user_info(username, password)
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