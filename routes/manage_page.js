let express = require('express')
let router = express.Router()
let authorize = require('../public/javascript/authorize')
let fs = require('fs')

async function check_if_id_exists(id){
    let buffer = await fs.promises.readFile('server/database/products.txt')
    let buffer_array = buffer.toString().split(';')
    for(const element of buffer_array){
      let ide = element.split(',')[0]
      if(ide == id){
        return true
      }
    }
    return false
  }

router.get('/', authorize, function(req, res, next) {
  console.log(`get request on /manage`)
  res.render('manage', {message1: '', message2: ''})
});

router.post('/', authorize, async function(req, res, next) {
    console.log(`get request on /manage`)
    let product_id = req.body.id
    let product_name = req.body.name
    let product_price = req.body.price
    let type = req.query['type']
    if(type == 'add'){
        if(! await check_if_id_exists(product_id)){
            await fs.promises.appendFile('server/database/products.txt', product_id + ',' + product_name + ',' + product_price + ';')
            res.render('manage', {message1: 'added new product', message2: ''})
        }else{
            res.render('manage', {message1: 'id already exists', message2: ''})
        }
    }else if(type == 'delete'){
        if(await check_if_id_exists(product_id)){
          let new_text = ''
          let buffer_ = await fs.promises.readFile('server/database/products.txt')
          let buffer = buffer_.toString().split(';')
          for(let product of buffer){
            console.log(product.split(',')[0])
            if(product.split(',')[0] != product_id){
              new_text += product + ';'
            }
          }
          await fs.promises.writeFile('server/database/products.txt', new_text)
          res.render('manage', {message1: '', message2: 'deleted'})
        }else{
            res.render('manage', {message1: '', message2: 'wrong id'})
        }
    }
  });

module.exports = router