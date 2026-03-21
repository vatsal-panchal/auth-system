import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import userModel from "../models/user.model.js";

// Middleware to verify JWT token and attach user to request
const verifyToken = asyncHandler(async (req, _, next) => {
  
  // Authorization header se token nikal rahe hai
  // format: "Bearer TOKEN"
  const token = req.headers.authorization?.split(" ")[1];

  // Agar token nahi mila to unauthorized
  if (!token) {
    throw new ApiError(401, "Access token is missing, please login first");
  }

  // Token verify kar rahe hai using secret key
  // yaha se decoded payload milega (id, email, etc)
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET
  );

  // Token me jo id hai usse database me user find kar rahe hai
  // password ko response me include nahi karna
  const user = await userModel
    .findById(decoded.id)
    .select("-password");

  // Agar user DB me nahi mila to unauthorized
  if (!user) {
    throw new ApiError(401, "User no longer exists, please register again");
  }

  // Request object me user attach kar rahe hai
  // taaki next controller use kar sake
  req.user = user;

  // Next middleware / controller ko call karo
  next();
});

export default verifyToken;