const express = require('express');
const router = express.Router()
const authController = require('../controllers/authController')
const User = require("../models/Users");

router.get('/', async (req, res) => {
    // If user logged in, set to true
    let userLoggedIn = req.cookies?.jwt_refresh ? true : false;
    let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
    res.render("login.ejs", { userLoggedIn, loggedInUser });
}).post('/', authController.loginHandler)

module.exports = router;