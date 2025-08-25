const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
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
    res.render("task", { user: user, userRoles: userRolesArr }); // Render the users.ejs template with the user object
}).post('/', require('../controllers/taskController').taskHandler);

module.exports = router;