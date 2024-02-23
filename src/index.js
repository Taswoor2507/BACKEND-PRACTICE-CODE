import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

try {
  await connectDB().then(() => {
    app.listen(process.env.PORT, () => {
      console.log("app running on port -->", process.env.PORT);
    });
  });
} catch (error) {
  console.log("Database connection filed due to error -->", error);
}
