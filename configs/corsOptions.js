const allowedOrigins = require('./allowedOrigins')

// CORS options
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }
}

module.exports = corsOptions;