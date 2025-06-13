const express = require('express');
const router = express.Router();
const logoutHandler = require('../controllers/logoutController').logoutHandler

router.get("/", logoutHandler)

module.exports = router;