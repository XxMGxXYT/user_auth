const Users = require('../models/Users');

const logoutHandler = async (req, res, next) => {
    const cookies = req.cookies;
    // Check if cookies not exist or jwt not exist
    if (!cookies?.jwt_refresh) return res.sendStatus(204); // Successful but No Content 
    // Get the user that has the same refresh token as the sent cookie
    const foundUser = await Users.findOne({ refreshToken: cookies.jwt_refresh }).exec()
    // Check if this is not the user and there is other users that have cookies
    try{
        if (foundUser) {
        res.clearCookie("jwt_refresh", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.clearCookie("jwt_access", { httpOnly: true, maxAge: 60 * 60 * 1000 })
        // Make the refreshToken property empty for the current user
        foundUser.refreshToken = ''
        await foundUser.save()
        // Clear the cookie
        res.redirect("/")
    }
    } catch(err){
        res.sendStatus(500); // Internal Server Error
        console.error(err);
    }
}

module.exports = { logoutHandler };
