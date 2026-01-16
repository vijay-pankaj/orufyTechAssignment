const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');

exports.auth = async (req, res, next) => {
  try {
    const completeToken = req.headers.authorization;

    if (!completeToken) {
      return res.status(401).json({ message: "Authentication Failed: No Token Provided" });
    }

    const token = completeToken.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication Failed: Token Not Found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Authentication Failed: User Not Found" });
    }

    req.userDetail = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
