const expressRoute = require("express");
const getTodo = require('../dto/get.todo.js')
const createTodo = require('../dto/create.todo.js')
const deleteTodo = require('../dto/delete.todo.js')
const updateTodo = require('../dto/update.todo.js')

const router = expressRoute.Router();

router.post("/todo", createTodo);

router.get("/getTodo/:userId", getTodo);

router.patch("/updateTodo/:id", updateTodo);

router.delete("/deleteTodo/:id", deleteTodo);

module.exports = router;
