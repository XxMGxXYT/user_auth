const express = require("express");
const router = express.Router();
const deleteUserController = require("../controllers/deleteUserController");

router.get("/", (req, res) => {
    // Middleware to check if the user is logged in
    if (!req.userObj) {
        return res.redirect("/login")
    } else {
        return res.redirect("/user/" + req.userObj.username)
    }
});

router.get("/:username", (req, res) => {
    let user = req.userObj; // Access the user object from the request
    let userRolesArr = []
    // loop on user roles
    for (let i = 0; i < Object.keys(user.roles).length; i++) {
        if (user.roles[Object.keys(user.roles)[i]] === 0) {
            continue
        } else {
            userRolesArr.push(Object.keys(user.roles)[i])
        }
    }
    res.render("users.ejs", { user: user, userRoles: userRolesArr }); // Render the users.ejs template with the user object
    // console.log("From routes:", req.userObj)
}).post("/:id", deleteUserController); // Route to delete a user

module.exports = router;