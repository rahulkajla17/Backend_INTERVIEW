import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({ apiKey: process.env.Google_GenAI_API_KEY });

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "the match score (0 to 100) between the candidate's resume/profile and the job description",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("the technical question can be asked during the interview"),
        intention: z
          .string()
          .describe("the intention behind the technical question"),
        answer: z.string().describe("the answer to the technical question"),
      }),
    )
    .describe("the technical questions can be asked during the interview"),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "the behavioral question can be asked during the interview",
          ),
        intention: z
          .string()
          .describe("the intention behind the behavioral question"),
        answer: z.string().describe("the answer to the behavioral question"),
      }),
    )
    .describe("the behavioral questions can be asked during the interview"),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("the skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("the severity of the skill gap"),
      }),
    )
    .describe("the skill gaps of the candidate"),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("the day of the preparation plan"),
        focus: z
          .string()
          .describe("the main focus of this day of the preparation plan"),
        tasks: z
          .array(z.string())
          .describe(
            "the tasks to be completed on this day of the preparation plan",
          ),
      }),
    )
    .describe("the preparation plan for the candidate"),
  title: z.string().describe("the title of the interview report"),
});

async function generateInterviewReport(
  resume,
  jobDescription,
  selfDescription,
) {
  const prompt = `generate the interview report for the candidate with the following details:
  Resume: ${resume}
  Job Description: ${jobDescription}
  Self Description: ${selfDescription}
  `;

  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(interviewReportSchema),
    },
  });

  const result = JSON.parse(interaction.output_text);
  console.log(result);
  return result;
}

export { generateInterviewReport, interviewReportSchema };
