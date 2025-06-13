const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/', (req, res) => {
    res.render("login.ejs")
}).post('/', authController.loginHandler)

module.exports = router;