const TodoModel = require('../models/todoModel.js');

require("dotenv").config();

const getTodo = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await TodoModel.findAll({ where: { userId } });
    if (data.length === 0) {
      return res.status(404).json({ error: "No todos found for this user" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = getTodo;
