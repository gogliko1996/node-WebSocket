const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const toduRouter = require("./todo/router/todoRouter.js");
const userRoute = require("./auth/router/user.Router.js");
const createUser = require("./user/router/create.user.router.js");
const sequelizeConfig = require("./config/config.js");
const fs = require("fs");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});
require("dotenv").config();
const cookieParser = require("cookie-parser");
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const sessionParser = require("express-session")({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
});

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set("wss", wss);

app.use(cookieParser());
app.use(sessionParser);

app.use(bodyParser.json());
app.use(cors());

app.use(toduRouter);
app.use(userRoute);
app.use(createUser);

wss.on("connection", (ws, req) => {
  console.log("conected");

  sessionParser(req, {}, () => {
    ws.userId = req.headers["sec-websocket-protocol"];
  });

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "USER_ID") {
      ws.userId = data.id;
    }
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  fs.readFile(indexPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Internal Server Error");
    }

    const modifiedHtml = data.replace(
      '<div id="root"></div>',
      `<div id="root">``<App />``</div>`
    );

    res.send(modifiedHtml);
  });
});

const startServer = async () => {
  try {
    await sequelizeConfig.authenticate();
    console.log("Connection has been established successfully.");

    await sequelizeConfig.sync({ alter: true });
    console.log("All models were synchronized successfully.");

    server.listen(process.env.APP_PORT, () => {
      console.log(`Server running on port ${process.env.APP_PORT}.`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
