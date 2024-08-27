const expressRoute = require("express");
const loginUsers = require("../dto/user.LogIn.js")

const router = expressRoute.Router();

router.post("/login", loginUsers.login);

router.post("/auth/refresh-token", loginUsers.usersRefreshToken);

router.get("/protected", loginUsers.protected);

module.exports = router