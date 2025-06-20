const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

const loginHandler = async (req, res) => {
    const { user, pwd } = req.body;
    // Check if user or password not delivered
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // Check if user not exist
    const foundUser = await Users.findOne({ username: user }).exec()
    if (!foundUser) return res.status(401).json({ "message": "User not authorized!" })
    // Check the password
    const match = await bcrypt.compare(pwd, foundUser.password)
    // Check if the password is correct
    if (match) {
        const roles = Object.values(foundUser.roles)
        // Create the JWTs
        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1m" }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        )
        // Saving the refresh token with the current user
        // const updatedUser = await Users.updateOne({ username: user }, { $set: { refreshToken: refreshToken } });
        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        // Create a cookie for storing the Refresh token
        res.cookie("jwt_refresh", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.cookie("jwt_access", accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 })
        res.redirect("/user")
    } else {
        res.sendStatus(401) // Unauthorized
    }
}

module.exports = { loginHandler };