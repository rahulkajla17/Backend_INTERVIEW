import "dotenv/config";
import { application } from "express";
import { app } from "./app.js";
import ConnectDB from "./db/index.js";

import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("server is not running", err);
  });
