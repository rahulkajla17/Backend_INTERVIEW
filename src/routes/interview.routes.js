import express from "express";
import { jwtverify } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  generateInterviewReportController,
  getinterviewReportByIdController,
  getAllInterviewReportsController,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

/**
 * @route /api/v1/interview
 * @description This route is used to generate an interview report based on the candidate's resume and job description.
 * @access private
 */

interviewRouter.post(
  "/interview",
  jwtverify,
  upload.single("resumeFile"),
  generateInterviewReportController,
);
/**
 * @route /api/v1/interview/report/:interrviewId
 * @description This route is used to get an interview report by ID.
 * @access private
 */
interviewRouter.get(
  "/report/:interrviewId",
  jwtverify,
  getinterviewReportByIdController,
);

/**
 * @route /api/v1/interview/reports
 * @description This route is used to get all interview reports for the logged-in user.
 * @access private
 */
interviewRouter.get("/reports", jwtverify, getAllInterviewReportsController);
export { interviewRouter };
