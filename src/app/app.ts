import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://e-commerce-kappa-mauve.vercel.app/", 
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    data: null,
  });
});

app.use("/api", router);

app.options("*", cors());

app.use(globalErrorHandler);
app.use(notFound);

export default app;
