const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: Boolean, default: false },
    // user: { type: Schema.Types.ObjectId, ref: "Users", required: true }
    userId: { type: String, required: true }
});

module.exports = mongoose.model("Tasks", taskSchema)