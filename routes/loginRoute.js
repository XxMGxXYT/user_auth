const express = require('express');
const router = express.Router()
const User = require("../models/Users");
const authController = require('../controllers/authController')

router.get('/', async (req, res) => {
    let userLoggedIn = req.cookies?.jwt_refresh ? true : false;
    let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
    if (!loggedInUser && userLoggedIn) {
        res.clearCookie("jwt_refresh"); // Clear the cookie if the user is not found
        if (req.cookies.jwt_access) {
            res.clearCookie("jwt_access"); // Clear the access cookie if it exists
        }
    }
    res.render("login.ejs", { userLoggedIn, loggedInUser })
}).post('/', authController.loginHandler)

module.exports = router;