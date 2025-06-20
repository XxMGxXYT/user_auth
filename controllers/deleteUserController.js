const User = require("../models/Users");

const deleteUserController = async (req, res) => {
    console.log("Delete user controller called");
    try {
        const userId = req.params.id
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Delete the user
        await User.findByIdAndDelete(userId);
        res.clearCookie("jwt_refresh", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.clearCookie("jwt_access", { httpOnly: true, maxAge: 5 * 60 * 1000 })
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = deleteUserController;