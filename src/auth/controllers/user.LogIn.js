const jwt = require("jsonwebtoken");
const GetUserModel = require('../../user/models/user.Model.js');
require("dotenv").config();

const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const REFRESH_SECRET_KEY = process.env.AWS_REFRESH_SECRET_KEY;

const login = async (req, res) => {
  const { email, password } = req.body;
  const getUser = await GetUserModel.findOne({ where: { email, password } });
  
  if (getUser) {
    const accessToken = jwt.sign(
      {
        id: getUser.dataValues.id,
        username: `${getUser.dataValues.firstName}${getUser.dataValues.lastname}`,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        id: getUser.dataValues.id,
        username: `${getUser.dataValues.firstName}${getUser.dataValues.lastname}`,
      },
      REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

module.exports = login;
