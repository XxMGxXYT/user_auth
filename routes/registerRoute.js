const express = require('express');
const router = express.Router()
const User = require("../models/Users");
const registerController = require('../controllers/registerController')

router.get('/', async (req, res) => {
    let userLoggedIn = req.cookies?.jwt_refresh ? true : false;
    let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
    if (userLoggedIn) {
        res.redirect(`/user/${loggedInUser.username}`); // Redirect to user profile if already registered
    } else {
        if (!loggedInUser && userLoggedIn) {
            res.clearCookie("jwt_refresh"); // Clear the cookie if the user is not found
            if (req.cookies.jwt_access) {
                res.clearCookie("jwt_access"); // Clear the access cookie if it exists
            }
        }
        res.render("register.ejs", { userLoggedIn, loggedInUser })
    }
}).post('/', registerController.handleNewUser)

module.exports = router