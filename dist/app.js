"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const body_parser_1 = __importDefault(require("body-parser"));
const userRouter = require("./router/autorisation.ts");
const sequelizeConfig = require('./config/config.ts');
const app = (0, express_1.default)();
require("dotenv").config();
app.use(body_parser_1.default.json());
app.use(cors());
app.use(userRouter);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelizeConfig.authenticate();
        console.log('Connection has been established successfully.');
        yield sequelizeConfig.sync({ alter: true });
        console.log('All models were synchronized successfully.');
        app.listen(process.env.APP_PORT, () => {
            console.log(`App running on port ${process.env.APP_PORT}.`);
        });
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
startServer();
