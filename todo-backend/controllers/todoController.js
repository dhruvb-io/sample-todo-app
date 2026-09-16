const Todo = require ("../models/todoModel")
const logger = require("../utils/logger")

exports.getTodos = async(req,res)=>{
    logger.info("Fetching the todos from DB")
    try{
        const todos = await Todo.find();
        // log.debug()
        logger.info("fetched all the todos ${JSON.stringify(todos)}")
        logger.info("Testing logger")
        res.status(200).json(todos)

    } catch (error) {
        logger.error("Error while fetching the todos", error)
        res.status(500).json({message: "Something went wrong, please try later"})
    }
}

exports.addTodo = async (req,res)=>{
    try {
        logger.info(`Request body is ${JSON.stringify(req.body)}`)
        const title  = req.body.title;
        // logger.info("Adding a new todo", req.body)
        logger.info(`Adding a new todo", ${title}`)
        const newTodo = new Todo({
            title: title
        })

        logger.info("Adding the todo to DB ", newTodo)
        const savedTodo = await newTodo.save()
        logger.info("Added the todo to DB ", savedTodo)

        res.status(200).json(savedTodo)

    }catch (error) {
        logger.error("Error while adding the todos", error)
        res.status(500).json({message: "Something went wrong, please try later"})
    }

        
}

exports.deleteTodo = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({message: "Todo ID is required"})
        }

        const deletedTodo = await Todo.findByIdAndDelete(req.params.id)

        if (!deletedTodo) {
            return res.status(404).json({message: "Todo not found"})
        }

        res.status(200).json(deletedTodo)
    } catch (error) {
        logger.error("Error while deleting the todo", error)
        res.status(500).json({message: "Something went wrong, please try later"})
    }
}

