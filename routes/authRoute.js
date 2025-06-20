const express = require('express');
const router = express.Router()
const User = require("../models/Users");
const authController = require('../controllers/authController')

router.get('/', async (req, res) => {
    let userLoggedIn = req.cookies?.jwt_refresh ? true : false;
    let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
    res.render("login.ejs", { userLoggedIn, loggedInUser })
}).post('/', authController.loginHandler)

module.exports = router;