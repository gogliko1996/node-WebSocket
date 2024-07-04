const TodoModel = require("../models/todoModel");

const setTodo = async (req, res) => {
  const { title, description, status, userId } = req.body;

  try {
    const newSetTodo = await TodoModel.create({
      title,
      description,
      status,
      userId,
    });
    res.status(201).json(newSetTodo);
  } catch (error) {
    res.status(401).json({ error: "An unexpected error occurred" });
  }
};

module.exports = setTodo;
