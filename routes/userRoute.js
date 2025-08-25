const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const deleteUserController = require("../controllers/deleteUserController");
const User = require("../models/Users");
const Task = require("../models/Task");

router.get("/", (req, res) => {
    // Middleware to check if the user is logged in
    if (!req.userObj) {
        return res.redirect("/login")
    } else {
        return res.redirect("/user/" + req.userObj.username)
    }
});

router.get("/:username", async (req, res) => {
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
    // Get all tasks from the database
    const tasks = await Task.find({ userId: user._id }).exec();
    console.log(tasks);
    res.render("user.ejs", { user: user, userRoles: userRolesArr, tasks }); // Render the users.ejs template with the user object
})
    .post("/:id", deleteUserController)
    .put("/:id", async (req, res) => {
        // Middleware to check if the user is logged in
        if (!req.userObj) {
            return res.redirect("/login")
        } else {
            const data = req.body;
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    username: data.username,
                    job: data.job,
                }
            }, { new: true });
            if (!user) {
                return res.status(404).send("User not found");
            }
            console.log("User updated successfully:", user);
            // Remove the old refresh and access tokens
            res.clearCookie("jwt_refresh");
            res.clearCookie("jwt_access");
            // Set the new user refresh and access tokens
            const roles = Object.values(user.roles)
            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": user.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            )
            const refreshToken = jwt.sign(
                { "username": user.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            )
            // Saving the refresh token with the current user
            user.refreshToken = refreshToken;
            await user.save();
            // Create a cookie for storing the Refresh token and access token
            res.cookie("jwt_refresh", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) // 1 day
            res.cookie("jwt_access", accessToken, { httpOnly: true, maxAge: 5 * 60 * 1000 }) // 5 minutes
            // Respond with the updated user data
            res.status(200).json({ message: "User updated successfully", user: user });
        }
    }).put("/task/:id", async (req, res) => {
        // Middleware to check if the user is logged in
        if (!req.userObj) {
            return res.redirect("/login")
        } else {
            const data = req.body;
            const task = await Task.findByIdAndUpdate(req.params.id, {
                $set: {
                    status: data.status,
                }
            }, { new: true });
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            console.log("Task updated successfully:", task);
            // Respond with the updated task data
            res.status(200).json({ message: "Task updated successfully", task: task });
        }
    }).delete("/task/:id", async (req, res) => {
        // Middleware to check if the user is logged in
        if (!req.userObj) {
            return res.redirect("/login")
        } else {
            const task = await Task.findByIdAndDelete(req.params.id);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            console.log("Task deleted successfully:", task);
            // Respond with the deleted task data
            res.status(200).json({ message: "Task deleted successfully", task: task });
        }
    });

module.exports = router;