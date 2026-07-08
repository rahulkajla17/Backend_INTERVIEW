import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getcurrentuser,
} from "../controllers/user.controller.js";
import { jwtverify } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(jwtverify, logoutUser);
router.route("/me").get(jwtverify, getcurrentuser);

export { router as userrouter };
