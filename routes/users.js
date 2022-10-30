var express = require('express')
const { getAll } = require('./users/get_all')
var router = express.Router()

/* GET users listing. */
router.get('/compatibility', getAll)

module.exports = router
