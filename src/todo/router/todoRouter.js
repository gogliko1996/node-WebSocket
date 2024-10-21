const expressRoute = require("express");
const getTodo = require('../controllers/get.todo.js')
const createTodo = require('../controllers/create.todo.js')
const deleteTodo = require('../controllers/delete.todo.js')
const updateTodo = require('../controllers/update.todo.js')

const router = expressRoute.Router();

router.post("/todo", createTodo);

router.get("/getTodo/:userId", getTodo);

router.patch("/updateTodo/:id", updateTodo);

router.delete("/deleteTodo/:id", deleteTodo);

module.exports = router;
