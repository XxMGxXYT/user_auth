// Libraries imports
require("dotenv").config();
const express = require('express');
const app = express();
const path = require("path");
const cors = require("cors");
// Custom imports
const logEvents = require("./logs.js");
const { log } = require("console");
const credentials = require('./middlewares/credentials')
const corsOptions = require('./configs/corsOptions')
const cookieParser = require("cookie-parser");
const verifyJWT = require('./middlewares/verifyJWT')
const verifyRoles = require('./middlewares/verifyRoles')
const USERS_ROLES = require('./configs/usersRoles')
const connectDB = require("./configs/connectDB");
const mongoose = require("mongoose");

// Connect to the database
connectDB()

// const EventEmitter = require("events");
// class MyEmitter extends EventEmitter { }
// const myEmitter = new MyEmitter();
// myEmitter.on("log", (msg) => logEvents(msg));
// myEmitter.emit("log", "Log event emitted!")

// Add the static middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded

app.use(express.json()) // for parsing application/json

app.use(cookieParser()) // for parsing cookies

// Sets the template langauge
app.set("view engine", "ejs");

// Middleware
app.use((req, res, next) => {
    logEvents(`${req.method} ${req.headers.origin} ${req.url}`, "reqLog.txt")
    next();
})

// Credentials middleware
app.use(credentials)

// CORS middleware
app.use(cors(corsOptions))

// The routes middlewares
app.use("/", require("./routes/route_one"));
app.use("/register", require("./routes/registerRoute"));
app.use("/login", require("./routes/authRoute"));
app.use("/refresh", require("./routes/refreshTokenRoute"));


// app.use(verifyJWT) // JWT middleware
app.use("/users", verifyJWT, require("./routes/usersRoute"));
// app.use("/users/:id", verifyJWT, require("./routes/usersRoute")); // This route is for a specific user
app.use("/logout", require("./routes/logoutRoute"));

// This middleware allows users to access the routes below only if they have a valid JWT token
// app.use(verifyRoles(USERS_ROLES.User)) // Roles middleware

// 404 route
app.use((req, res) => {
    res.status(404).render("404.ejs")
})

// This middleware allows only admins to access the routes below
app.use(verifyRoles(USERS_ROLES.Admin)) // Roles middleware
app.use("/subdir", require("./routes/route_two"));

// Error handler
app.use((err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, "errLog.txt")
    console.error(err.stack)
    res.status(500).send(err.message)
})

// Start the server if the database is connected

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port http://localhost:${process.env.PORT}`);
    });
});
