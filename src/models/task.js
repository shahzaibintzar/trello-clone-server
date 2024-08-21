const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
    email: {type: String, required: true},
    title: {type: String, required: true},
    discription: {type: String, required: true},
    category: {type: String, required: true},
    dueDate: {type: String, required: true},
    priority: {type: String, required: true},
},
{ collection: "task", versionKey: false }
)
const Task = mongoose.model ( "UserTask",userTaskSchema )

module.exports = Task;