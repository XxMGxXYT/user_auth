const Task = require('../models/Task');

async function taskHandler(req, res) {
    // Handle the form submission here
    const obj = req.body;

    // Here you would typically save the task to a database
    const newTask = await Task.create({
        title: obj.title,
        description: obj.description,
        status: obj.status,
        userId: obj.userId
    })
    // Redirect back to the task page or wherever you want
    res.redirect('/addtask');
}

module.exports = { taskHandler };