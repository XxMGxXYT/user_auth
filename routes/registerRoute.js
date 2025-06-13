const express = require('express');
const router = express.Router()
const registerController = require('../controllers/registerController')

router.get('/', (req, res) => {
    res.render("register.ejs")
}).post('/', registerController.handleNewUser)

module.exports = router