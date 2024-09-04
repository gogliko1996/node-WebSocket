const TodoModel = require('../models/todoModel.js');
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

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


  module.exports = updateTodo