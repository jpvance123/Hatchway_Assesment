const express = require('express')
const router = express.Router()


const { pingApi } = require('../controllers/ping.js');

router.get('/', pingApi);


module.exports = router