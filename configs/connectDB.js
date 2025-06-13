const mongoose = require('mongoose');

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
    } catch (err) {
        console.error("Could not connect to MongoDB", err);
    }
}

module.exports = dbconnect;