import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB = async () => {
  try {
    const db_connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
  } catch (error) {
    console.log("MONGODB connecgtion Failed!!!", error);
    process.exit(1);
  }
};

export default ConnectDB;
