const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const refreshTokenHandler = async (req, res) => {
    const cookies = req.cookies;
    // Check if cookies not exist or jwt not exist
    if (!cookies?.jwt_refresh) return res.sendStatus(401);
    // Check if user not exist
    const foundUser = await Users.findOne({ refreshToken: cookies.jwt_refresh }).exec();
    if (!foundUser) return res.redirect("/login"); // Forbidden and need to login again
    // Evaluate JWT
    jwt.verify(cookies.jwt_refresh, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403) // Forbidden
        // Refresh token is valid and matches the user
        const roles = Object.values(foundUser.roles)
        // Create new access token
        const newAccessToken = jwt.sign(
            {
                "userInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1m" }
        )
        res.cookie("jwt_access", newAccessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 })
        res.redirect("/users")
    })
}

module.exports = { refreshTokenHandler };