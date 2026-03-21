import { Router } from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(verifyToken,logout);
authRouter.route("/getme").get(verifyToken,getMe);

export { authRouter };
