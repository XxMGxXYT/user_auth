const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = Schema({
    username: { type: String, required: true },
    roles: {
        User: { type: Number, default: 2001 },
        Admin: { type: Number, default: 0 },
        Editor: { type: Number, default: 0 },
        Moderator: { type: Number, default: 0 }
    },
    password: { type: String, required: true },
    gender: { type: String, default: undefined },
    job: { type: String, default: undefined },
    refreshToken: String,
})

module.exports = mongoose.model("Users", usersSchema)