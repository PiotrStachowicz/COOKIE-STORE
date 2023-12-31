let express = require('express');
let router = express.Router();
let fs = require('fs')
const COOKIE_EXPIRATION_TIME = 2592000000 // 30 days in ms

function get_product(products, id){
  for(const product of products){
    if(id === product.id){
      return product
    }
  }
  return undefined
}

function is_logged(req){
  if(req.signedCookies['admin'] != undefined || req.signedCookies['user'] != undefined){
    return true
  }else{
    return false
  }
}

router.route('/')
  .get(async function(req, res, next) {
    console.log(`get request on /`);
    await handle_request(req, res);
  }).post(async function(req, res, next) {
    console.log(`post request on /`);
    await handle_request(req, res);
  })

async function handle_request(req, res, next) {
  let username = ""
  let logged = false
  let admin = false
  let products_buffer = await fs.promises.readFile('server/database/products.txt')
  let products_array = products_buffer.toString().split(';')
  let products = []

  if(req.signedCookies['cart'] != undefined){
    count = req.signedCookies['cart'].cart.length
  }else{
    res.cookie('cart', {cart: []}, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
  }

  // CHANGE FROM TXT TO DATABASE
  for(const product of products_array){
    let product_id = product.split(',')[0]
    let product_name = product.split(',')[1]
    let product_price = product.split(',')[2]
    if(product != ''){
      products.push({id: product_id, name: product_name, price: product_price})
    }
  }

  if(req.signedCookies.admin){
    username = req.signedCookies.admin
    logged = true
    admin = true
  }else if(req.signedCookies.user){
    username = req.signedCookies.user
    logged = true
  }
  
  if(is_logged(req)){
    let id = req.query.id

    if(id != undefined && req.signedCookies['cart'] != undefined){
      new_cart = req.signedCookies['cart'].cart
      new_cart.push(get_product(products, id))
      res.cookie('cart', {cart: new_cart}, {signed: true, maxAge: COOKIE_EXPIRATION_TIME})
    }
  }
  
  res.render('home', { username: username, logged: logged, admin: admin, products: products});
};

module.exports = router;