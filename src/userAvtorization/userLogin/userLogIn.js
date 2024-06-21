const jwt = require("jsonwebtoken");
const GetUserModel = require("../../models/userModels/userModel.ts");
require("dotenv").config();

const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const REFRESH_SECRET_KEY = process.env.AWS_REFRESH_SECRET_KEY;

let refreshTokens = [];

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
      REFRESH_SECRET_KEY
    );

    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } else {
    res.status(401).json({ message: "Email or password is invalid" });
  }
};

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

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  });
};

const protected = async(req, res) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await GetUserModel.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Welcome to the protected route', user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};



module.exports = { protected, login, usersRefreshToken };
