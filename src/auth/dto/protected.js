const jwt = require("jsonwebtoken");
const GetUserModel = require('../../user/models/user.Model.js');
require("dotenv").config();

const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const protected = async (req, res) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await GetUserModel.findByPk(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

    res.json({ message: "Welcome to the protected route", user });
  } catch (err) {
    return res.status(500).json({ message: "Failed to authenticate token" });
  }
};

module.exports = protected
