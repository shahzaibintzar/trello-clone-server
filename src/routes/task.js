const express = require('express');
const router = express.Router();
const Task = require("../models/task");
const jwt = require("jsonwebtoken");



//POST Api
 router.post('/addTask', async (req, res) => {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);
const email = decode.email
    const userTask = new Task({
        email:email,
        title: req.body.title,
        discription: req.body.discription,
        category: req.body.category,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
    });

    try {
        const savedTask = await userTask.save();
        res.status(200).json({savedTask ,message:'Task Post sucessfully'});
    } catch (error) {
        res.status(400).json({error , message:"Task is not Added"});
    }
});
//GET
router.get('/getTask', async (req,res)=>{
    try {
        const tasks = await Task.find();
        res.status(200).json({tasks , message:'Task Get sucessfully'});
    } catch (error) {
        res.status(400).json({error , message:"No Tasks"});
    }
})
//DELETE

router.delete('/deleteTask/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({deletedTask,
            message: 'Task deleted successfully'} );
    } catch (error) {
        res.status(400).json({error , message:"Task not deleted"});
    }
});

//PUT

router.put('/updateTask/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({message:'Task Updated sucessfully',updatedTask});
    } catch (error) {
        res.status(400).json({error , message:"Task not Updated"});
    }
});

// get authenticated user tasks

router.get('/getAuthenticatedTask', async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;

        const tasks = await Task.find({ email: email });
        res.status(200).json({ tasks, message: 'Authenticated Tasks get  successfully' });
    } catch (error) {
        res.status(400).json({error , message:"This User is not created any task."});
    }
});


// get tasks from search query

router.get('/getsearchtasks',async (req,res)=>{
    try {
        const searchQuery = "physics";
        const tasks = await Task.find({title:searchQuery});
        res.status(200).json({tasks, message:"Tasks get successfully by search query"});
    } catch (error) {
        res.status(400).json ({error , message:"Error getting tasks by search query"})
    }
})

module.exports = router;