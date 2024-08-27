const expressRoute = require("express");
const loginUsers = require("../userLogin/userLogIn.js")
const userRegister = require("../userRegister/register.js");

const router = expressRoute.Router();

router.post("/login", loginUsers.login);

router.post("/register", userRegister);

router.post("/auth/refresh-token", loginUsers.usersRefreshToken);

router.get("/protected", loginUsers.protected);

module.exports = router