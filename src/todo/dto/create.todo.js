const TodoModel = require("../models/todoModel.js");
const WebSocket = require("ws");

const createTodo = async (req, res) => {
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

module.exports = createTodo;
