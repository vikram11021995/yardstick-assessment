// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtVerifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate("tenant");
    if (!req.user) return res.status(401).json({ error: "Invalid token" });

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = jwtVerifyToken;
