const express = require('express');
const router = express.Router()
const registerController = require('../controllers/registerController')
const User = require("../models/Users");

router.get('/', async (req, res) => {
    // If user logged in, set to true
    let userLoggedIn = req.cookies?.jwt_access ? true : false;
    let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
    res.render("register.ejs", { userLoggedIn, loggedInUser });
}).post('/', registerController.handleNewUser)

module.exports = router