import asycnHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/ApiResponse.js";
import userModel from "../models/user.model.js";
import generateTokens from "../utils/generateTokens.js";

const register = asycnHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existedUser = await userModel.findOne({
    $or: [{ name }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this name or email already exists");
  }

  const user = await userModel.create({
    name,
    email,
    password,
  });

  const createdUser = await userModel.findById(user._id).select("-password");

  res
    .status(201)
    .json(
      new Apiresponse(201, { user: createdUser }, "Registered successfully"),
    );
});

const login = asycnHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    throw new ApiError(400, "Name and password are required");
  }

  const user = await userModel.findOne({ name });

  if (!user) {
    throw new ApiError(404, "No account found with this name");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password, please try again");
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  const loggedInUser = await userModel.findById(user._id).select("-password");

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json(
      new Apiresponse(
        200,
        { user: loggedInUser, accessToken },
        "Login successful",
      ),
    );
});

const logout = asycnHandler(async (req, res) => {
  res
    .clearCookie("refreshToken")
    .status(200)
    .json(new Apiresponse(200, {}, "Logged out successfully"));
});

const getMe = asycnHandler(async (req, res) => {
  res.status(200).json(
    new Apiresponse(200, { user: req.user }, "User fetched successfully"),
  );
});

export { register, login, logout, getMe };