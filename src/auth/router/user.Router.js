const expressRoute = require("express");
const login = require("../dto/user.LogIn.js")
const usersRefreshToken = require('../dto/users.RefreshToken.js')
const protected = require('../dto/protected.js')

const router = expressRoute.Router();

router.post("/login", login);

router.post("/auth/refresh-token", usersRefreshToken);

router.get("/protected", protected);

module.exports = router