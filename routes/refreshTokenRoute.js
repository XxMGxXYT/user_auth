const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController.js')

router.get('/', refreshTokenController.refreshTokenHandler)

module.exports = router;