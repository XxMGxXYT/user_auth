const express = require('express');
const router = express.Router()
const User = require("../models/Users");
const registerController = require('../controllers/registerController')

router.get('/', async (req, res) => {
    let userLoggedIn = req.cookies?.jwt_refresh ? true : false;
    let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
    res.render("register.ejs", { userLoggedIn, loggedInUser })
}).post('/', registerController.handleNewUser)

module.exports = router