import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose, { ConnectOptions } from "mongoose";
import userRoute from "../Routes/userRoutes";
import BlogRoute from "../Routes/blogRoutes";
import CommentRoute from "../Routes/commentRoutes";

import MessageRoute from "../Routes/messageRoutes";
import bodyParser from "body-parser";
dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL_TEST || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Something went wrong", err);
  });

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  return res.json({ message: "Welcome  To My portfolio API" });
});

app.use("/api/users", userRoute);
app.use("/api/blogs", BlogRoute);
app.use("/api/messages", MessageRoute);
app.use("/api/com/like", CommentRoute);
// const PORT = process.env.PORT_TEST || 6000;
// app.listen(PORT);

export default app;
