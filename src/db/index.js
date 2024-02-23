import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async function () {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Database connect successfully on port  --> ${connectionInstance.connection.port}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
