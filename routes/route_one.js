const express = require("express");
const router = express.Router();

// First route
router.get(/^\/$|index(.html)?/, (req, res) => {
    res.render("index.ejs")
})

module.exports = router;