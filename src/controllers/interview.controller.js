import { PDFParse } from "pdf-parse";
import { InterviewReportModel } from "../models/InterviewReport.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { generateInterviewReport } from "../services/ai.service.js";

/**
 * @desc Generate an interview report using AI
 * @route POST /api/interview/generate
 * @access Private
 */
const generateInterviewReportController = asynchandler(async (req, res) => {
  const resumeFile = req.file;
  if (!resumeFile) {
    return res
      .status(400)
      .json({ status: "error", message: "Resume file is required" });
  }

  const parser = new PDFParse({ data: new Uint8Array(resumeFile.buffer) });
  const result = await parser.getText();
  const resumeContent = result.text;

  const { selfDescription, jobDescription } = req.body;

  const interviewReportbyAi = await generateInterviewReport(
    resumeContent,
    jobDescription,
    selfDescription,
  );

  const interviewreport = await InterviewReportModel.create({
    user: req.user._id,
    resumeText: resumeContent,
    selfDescription,
    jobDescriptionSchema: jobDescription,
    ...interviewReportbyAi,
  });

  res.status(201).json({
    status: "success",
    message: "Interview report generated successfully",
    data: interviewreport,
  });
});

/**
 * @desc Get an interview report by ID
 * @route GET /api/interview/:interrviewId
 * @access Private
 */
async function getinterviewReportByIdController(req, res) {
  const { interrviewId } = req.params;

  const interviewReport = await InterviewReportModel.findById(interrviewId);
  if (!interviewReport) {
    return res
      .status(404)
      .json({ status: "error", message: "Interview report not found" });
  }
  res.status(200).json({
    status: "success",
    data: interviewReport,
  });
}

/** */

async function getAllInterviewReportsController(req, res) {
  const interviewReports = await InterviewReportModel.find({
    user: req.user._id,
  })
    .sort({ createdAt: -1 })
    .select(
      "-resumeText -selfDescription -jobDescriptionSchema -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -__v",
    );

  res.status(200).json({
    status: "success",
    data: interviewReports,
  });
}
export {
  generateInterviewReportController,
  getinterviewReportByIdController,
  getAllInterviewReportsController,
};
