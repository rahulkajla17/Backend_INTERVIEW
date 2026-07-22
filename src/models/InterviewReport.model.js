import mongoose, { Schema } from "mongoose";

/**
 * - job description schema :String
 * - resume text : String
 * - Self description : String
 *
 * - matchScore : Number
 *
 * - Technical questions :
 *      [{
 *          question : "",
 *          intention : "",
 *          answer : "",
 *      }]
 * - Behavioral questions : [
 *      {
 *          question : "",
 *          intention : "",
 *          answer : "",
 *      }
 * ]
 * - Skill gaps : [{
 *      skill : "",
 *      severity : {
 *          type : String,
 *          enum : ["low", "medium", "high"]
 *      }
 * }]
 * - preparation plan :[{
 *      day : Number,
 *      focus : String,
 *      tasks: [String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioral question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    id: false,
  },
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    tasks: [
      {
        type: String,
        required: [true, "Task is required"],
      },
    ],
  },
  {
    id: false,
  },
);

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescriptionSchema: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const InterviewReportModel = mongoose.model(
  "InterviewReport",
  interviewReportSchema,
);

export { InterviewReportModel };
