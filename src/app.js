import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "18kb",
  })
);

app.use(
  express.urlencoded({
    limit: "18kb",
    extended: true,
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// import routes
import userRouter from "./routes/userRouter.js";
//
app.use("/api/v1/user", userRouter);

export default app;
