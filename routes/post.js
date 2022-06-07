const express = require('express')
const router = express.Router()


const { postAPI } = require('../controllers/post');

router.get('/:tags?/:sortBy?/:direction?', postAPI);


module.exports = router