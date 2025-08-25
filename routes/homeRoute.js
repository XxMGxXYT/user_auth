const express = require("express");
const router = express.Router();
const User = require("../models/Users");

// First route
router.get(/^\/$|home(.html)?/, async (req, res) => {
    let userLoggedIn = req.cookies?.jwt_refresh ? true : false;
    let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
    if (!loggedInUser && userLoggedIn) {
        res.clearCookie("jwt_refresh"); // Clear the cookie if the user is not found
        if (req.cookies.jwt_access) {
            res.clearCookie("jwt_access"); // Clear the access cookie if it exists
        }
    }
    res.render("home.ejs", { userLoggedIn, loggedInUser }); // Render the index.ejs template with a null users object
    // console.log("From index route:", users);
})

module.exports = router;