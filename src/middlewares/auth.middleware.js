import { User } from "../models/user.model";
import { apiError } from "../utils/apierror";
import { asynchandler } from "../utils/asynchandler";
import jwt from "jsonwebtoken";

export const jwtverify = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new apiError(401, "unauthorized request, NO token provided");
    }

    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedtoken?._id)?.select(
      "-password -RefreshToken",
    );

    if (!user) {
      throw new apiError(401, "user not found, Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access token");
  }
});
