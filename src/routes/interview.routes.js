import express from "express";
import { jwtverify } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { generateInterviewReportController } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

/**
 * @route /api/v1/interview
 * @description This route is used to generate an interview report based on the candidate's resume and job description.
 * @access private
 */

interviewRouter.post(
  "/",
  jwtverify,
  upload.single("resumeFile"),
  generateInterviewReportController,
);

export { interviewRouter };
