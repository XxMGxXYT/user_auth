const jwt = require('jsonwebtoken');
const Users = require("../models/Users")

const verifyJWT = (req, res, next) => {
    // Check if the authorization header is present and starts with "Bearer "
    // If not, send a 401 Unauthorized status
    const accessToken = req.cookies.jwt_access // Get the JWT from cookies
    if (!accessToken) return res.redirect("/login") // Unauthorized access
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            if (req.cookies.jwt_refresh) {
                // If the access token is invalid but a refresh token exists, redirect to refresh route
                return res.redirect("/refresh")
            } else {
                res.clearCookie('jwt_access', { httpOnly: true });
                res.render("forbidden.ejs")
            }
        } else {
            const theUser = await Users.findOne({ username: decoded.userInfo.username }).exec()
            req.userObj = theUser
            next()
        }
    })
}

module.exports = verifyJWT