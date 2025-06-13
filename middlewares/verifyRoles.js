const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if there is a roles in the request object
        // If there is no roles, return 401 Unauthorized
        if (!req?.roles) return res.sendStatus(401) // Unauthorized
        const rolesArray = [...allowedRoles]
        // Check the roles that came in the rolesArray, and see if it's included in the request roles
        const results = req.roles.map((role) => rolesArray.includes(role)).find(val => val === true)
        if (!results) return res.sendStatus(401) // Unauthorized
        next()
    }
}

module.exports = verifyRoles;