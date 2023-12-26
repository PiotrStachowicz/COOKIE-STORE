let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  console.log('get request on /')
  res.render('home_page', { title: 'get' });
});

router.post('/', function(req, res, next) {
  console.log('post request on /')
  res.render('home_page', { title: 'post' });
});

module.exports = router;