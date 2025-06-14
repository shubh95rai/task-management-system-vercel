import User from "../models/User.js";
import jwt from "jsonwebtoken";

// middleware for protecting backend routes
async function protect(req, res, next) {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.id).select("-password");
      req.user = user;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorised user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Token failed",
      error: error.message,
    });
  }
}

// middleware for admin-only access
async function adminOnly(req, res, next) {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { protect, adminOnly };
