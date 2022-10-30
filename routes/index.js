var express = require('express')
var router = express.Router()
var getAll = require('./users/get_all')
/* GET home page. */
router.get('', (req, res) => {
  console.log('hello world!')
  res.render('index', { title: 'jeff' })
  // res.json('hello world!').status(200)
})

module.exports = router
