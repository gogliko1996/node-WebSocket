const TodoModel = require("./models/todoModel");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const setTodo = async (req, res) => {
  const wss = req.app.get("wss");
  const { title, description, status, userId } = req.body;
  try {
    const data = await TodoModel.create({
      title,
      description,
      status,
      userId,
    });

    wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        Number(client.userId) === userId
      ) {
        client.send(
          JSON.stringify({
            type: "Create_User",
            payload: data,
          })
        );
      }
    });

    res.status(201);
  } catch (error) {
    console.error("Error:", error);
    return res.status(401).json({ error: "An unexpected error occurred" });
  }
};

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

const updateTodo = async (req, res) => {
  const wss = req.app.get("wss");
  const identitication = req.headers["authorization"]
  const { id } = req.params;
  const { title, description, status, startStatus} = req.body;

  const token = identitication.split(" ")[1]
  const user = jwt.verify(token, SECRET_KEY)

  try {
    const data = await TodoModel.findByPk(id);

    if (!data) {
      return res.status(404).json({ error: "Todo not found" });
    }

    data.title = title || data.title;
    data.description = description || data.description;
    data.status = status || data.status;
    data.startStatus = startStatus || data.startStatus;

    await data.save();

    wss.clients.forEach((client) => {

      if (
        client.readyState === WebSocket.OPEN &&
        Number(client.userId) === user.id
      ) {
        client.send(
          JSON.stringify({
            type: "UPDATE_TODO",
            payload: data,
          })
        );
      }
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const deleteTodo = async (req, res) => {
  const wss = req.app.get("wss");
  const identitication = req.headers["authorization"]
  const { id } = req.params;

  const token = identitication.split(" ")[1]
  const user = jwt.verify(token, SECRET_KEY)

  try {
    const data = await TodoModel.findByPk(id);

    if (!data) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await data.destroy();

    wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        Number(client.userId) === user.id
      ) {
        client.send(
          JSON.stringify({
            type: "Delete",
            payload: data,
          })
        );
      }
    });

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = { setTodo, getTodo, updateTodo, deleteTodo };
