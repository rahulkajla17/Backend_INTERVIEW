import { application } from "express";
import { app } from "./app.js";
import dotenv from "dotenv";
import ConnectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("server is not running", err);
  });
