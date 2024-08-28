const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const REFRESH_SECRET_KEY = process.env.AWS_REFRESH_SECRET_KEY;

const usersRefreshToken = (req, res) => {
    const { refreshToken } = req.cookies;
  
    if (!refreshToken) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
  
      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
  
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
      res.json({ accessToken: newAccessToken });
    });
  };

  module.exports = usersRefreshToken