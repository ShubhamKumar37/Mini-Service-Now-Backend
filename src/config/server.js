import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "../routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));

app.use("/auth", userRoute);


export default app;