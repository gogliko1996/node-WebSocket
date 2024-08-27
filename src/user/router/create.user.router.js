const expressRoute = require("express");

const createUser = require("../dto/create.user.js");

const router = expressRoute.Router();

router.post("/register", createUser);

module.exports = router