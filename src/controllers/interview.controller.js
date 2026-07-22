import { PDFParse } from "pdf-parse";
import { InterviewReportModel } from "../models/InterviewReport.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { generateInterviewReport } from "../services/ai.service.js";

const generateInterviewReportController = asynchandler(async (req, res) => {
  const resumeFile = req.file;
  if (!resumeFile) {
    return res.status(400).json({ status: "error", message: "Resume file is required" });
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

export { generateInterviewReportController };
