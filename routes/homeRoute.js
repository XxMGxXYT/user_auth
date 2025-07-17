const express = require("express");
const router = express.Router();
const User = require("../models/Users");

// First route
router.get(/^\/$|home(.html)?/, (req, res) => {
    res.render("home.ejs");
})

module.exports = router;