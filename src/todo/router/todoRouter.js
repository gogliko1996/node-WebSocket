const expressRoute = require("express");
const todo = require("../setTodo.js");

const router = expressRoute.Router();

router.post("/todo", todo.setTodo);

router.get("/getTodo/:userId", todo.getTodo);

router.patch("/updateTodo/:id", todo.updateTodo);

router.delete("/deleteTodo/:id", todo.deleteTodo);

module.exports = router;
