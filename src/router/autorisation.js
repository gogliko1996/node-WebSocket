const expressRoute = require("express");
const loginUsers = require("../userAvtorization/userLogin/userLogIn.js");
const userRegister = require("../userAvtorization/userRegister/register.js");
const todo = require("../fanction/setTodo.js");

const router = expressRoute.Router();

router.post("/login", loginUsers.login);

router.post("/register", userRegister);

router.post("/auth/refresh-token", loginUsers.usersRefreshToken);

router.get("/protected", loginUsers.protected);

router.post("/todo", todo.setTodo);

router.get("/getTodo/:userId", todo.getTodo);

router.patch("/updateTodo/:id", (req,res) => {
    todo.updateTodo(req, res, req.app.get('wss'))
 });

router.delete("/deleteTodo/:id", todo.deleteTodo);

module.exports = router;
