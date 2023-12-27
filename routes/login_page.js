let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt')
let fs = require('fs')
//let authorize = require('authorize') WTD
let admin_username = 'gacek'
let admin_password = '1234'

async function check(file, username){
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

async function save(username, password){
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
    let psswrd = await check('server/database/logindata.txt', username)
    if(username === admin_username && password === admin_password){
      res.cookie("admin", username, {signed: true, maxAge: 50000})
      res.redirect('/')
    }else if(psswrd !== undefined && await bcrypt.compare(password, psswrd)){
      res.cookie("admin", username, {signed: true, maxAge: 50000})
      res.redirect('/');
    }else{
      res.render('login', {message: 'incorrect username or password', message1: ''});
    }
  }else{
    if(await check('server/database/logindata.txt', username) === undefined && username != 'gacek'){
      save(username, password)
      res.cookie("user", username, {signed: true})
      res.redirect('/');
    }else{
      res.render('login', {message: '', message1: 'username already exists'});
    }
  }
});

module.exports = router;