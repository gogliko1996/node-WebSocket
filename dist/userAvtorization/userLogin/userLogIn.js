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
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const GetUserModel = require("../../models/userModels/userModel.ts");
require("dotenv").config();
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const REFRESH_SECRET_KEY = process.env.AWS_REFRESH_SECRET_KEY;
let refreshTokens = [];
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const getUser = yield GetUserModel.findOne({ where: { email, password } });
    if (getUser) {
        const accessToken = jwt.sign({
            id: getUser.dataValues.id,
            username: `${getUser.dataValues.firstName}${getUser.dataValues.lastname}`,
        }, SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jwt.sign({
            id: getUser.dataValues.id,
            username: `${getUser.dataValues.firstName}${getUser.dataValues.lastname}`,
        }, REFRESH_SECRET_KEY);
        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
    }
    else {
        res.status(401).json({ message: "Email or password is invalid" });
    }
});
const usersRefreshToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    if (!refreshTokens.includes(token)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    jwt.verify(token, REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ accessToken: newAccessToken });
    });
};
const protectedRoute = (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    jwt.verify(token, `${SECRET_KEY}`, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: "Failed to authenticate token" });
        }
        res.json({ message: "Welcome to the protected route", user: decoded });
    });
};
module.exports = { protectedRoute, login, usersRefreshToken };
