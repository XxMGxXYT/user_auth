const Users = require("../models/Users")
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd, gender, job } = req.body;
    // check for missing fields
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db
    const duplicate = await Users.findOne({ username: user }).exec()
    if (duplicate) {
        return res.status(409).json({ 'message': 'Username already exists.' });
    } //Conflict
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        if (gender && job) {
            //store the new user with gender and job
            const newUser = await Users.create({
                "username": user,
                "password": hashedPwd,
                "gender": gender,
                "job": job
            });
        } else if (gender) {
            //store the new user with gender
            const newUser = await Users.create({
                "username": user,
                "password": hashedPwd,
                "gender": gender
            });
        } else if (job) {
            //store the new user with job
            const newUser = await Users.create({
                "username": user,
                "password": hashedPwd,
                "job": job
            });
        } else {
            //store the new user only
            const newUser = await Users.create({
                "username": user,
                "password": hashedPwd,
            });
        }
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { handleNewUser };