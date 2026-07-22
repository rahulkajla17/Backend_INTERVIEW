import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

import { interviewRouter } from "./routes/interview.routes.js";

app.use(express.json({ limit: "16KB" }));
app.use(express.urlencoded({ limit: "16KB", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import { userrouter } from "./routes/user.routes.js";
app.use("/api/v1/users", userrouter);
app.use("/api/v1/interview", interviewRouter);

export { app };
