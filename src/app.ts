const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./router/autorisation.ts");
const sequelizeConfig = require('./config/config.ts'); 
const app = express();

require("dotenv").config();


app.use(bodyParser.json());
app.use(cors());
app.use(userRouter);

const startServer = async () => {
  try {
    await sequelizeConfig.authenticate();
    console.log('Connection has been established successfully.');

    await sequelizeConfig.sync({ alter: true }); 
    console.log('All models were synchronized successfully.');

    app.listen(process.env.APP_PORT, () => {
      console.log(`App running on port ${process.env.APP_PORT}.`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();

