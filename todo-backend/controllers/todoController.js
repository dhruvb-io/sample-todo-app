const Todo = require ("../models/todoModel")

exports.getTodos = async(req,res)=>{
    try{
        const todos = await Todo.find();
        console.log("fetched all the todos", todos)
        res.status(200).json(todos)

    }catch (error) {
        console.log("Error while fetching the todos", error)
        res.status(500).json({message: "Something went wrong, please try later"})
    }
}

exports.addTodo = async (req,res)=>{
        const title  = req.body;
        // console.log("Adding a new todo", req.body)
        console.log("Adding a new todo", title.todo)
        const newTodo = new Todo({
            title: title.todo
        })

        console.log("Adding the todo to DB ", newTodo)
        const savedTodo = await newTodo.save()
        console.log("Added the todo to DB ", savedTodo)

        res.status(200).json(savedTodo)
}

