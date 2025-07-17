const express = require("express");
const router = express.Router();
const User = require("../models/Users");

// First route
router.get(/^\/$|users(.html)?/, async (req, res) => {
    let users = await User.find().sort({ createdAt: -1 }); // Fetch all userss from the database and sort them by creation date
    if (users === null || users.length === 0) {
        res.render("users.ejs", { users: null }); // Render the index.ejs template with a null users object
    } else {
        let userLoggedIn = req.cookies?.jwt_refresh ? true : false;
        let loggedInUser = await User.findOne({ refreshToken: req.cookies.jwt_refresh });
        if (!loggedInUser && userLoggedIn) {
            res.clearCookie("jwt_refresh"); // Clear the cookie if the user is not found
            if (req.cookies.jwt_access) {
                res.clearCookie("jwt_access"); // Clear the access cookie if it exists
            }
        }
        let userRolesArr = [];
        // Loop through the users and extract roles
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let singleArr = [];
            for (let j = 0; j < Object.keys(user.roles).length; j++) {
                if (user.roles[Object.keys(user.roles)[j]] === 0) {
                    continue;
                } else {
                    singleArr.push(Object.keys(user.roles)[j]);
                }
            }
            userRolesArr.push(singleArr);
        }
        res.render("users.ejs", { users, userRolesArr, userLoggedIn, loggedInUser }); // Render the index.ejs template with a null users object
        // console.log("From index route:", users);
    }
})

module.exports = router;