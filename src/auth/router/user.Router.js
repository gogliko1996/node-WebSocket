const expressRoute = require("express");
const login = require("../controllers/user.LogIn.js")
const usersRefreshToken = require('../controllers/users.RefreshToken.js')
const protected = require('../controllers/protected.js')

const router = expressRoute.Router();

router.post("/login", login);

router.post("/auth/refresh-token", usersRefreshToken);

router.get("/protected", protected);

module.exports = router