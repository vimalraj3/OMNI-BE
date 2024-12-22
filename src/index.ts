import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { config } from "dotenv";
import { AppError, globalErrorHandler } from "./services/errorHandling.service";
import userRoutes from "./routes/user.route";
import investmentRoutes from "./routes/investment.route";
import dbConfig from "./configs/database.config";
import { dataSource } from "./configs/dataSource";
import cors from "cors";
import morgan from "morgan";

// ========== CONFIGURATIONS ========== //
config();
console.log(
  process.env.NODE_ENV,
  process.env.EMAIL_FROM,
  process.env.EMAIL_PASSWORD
);
const app = express();
const PORT = process.env.PORT || 3001;
dbConfig();

app.set("trust proxy", true);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev"));

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ========== ROUTES ========== //
app.all("/", (req: Request, res: Response) =>
  res.send("HELLO FROM OMNISTOCK SERVER")
);

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

app.use("/api/v2/user", userRoutes);
app.use("/api/v2/investment", investmentRoutes);

// ========== ERROR HANDLING ========== //
app.all("*", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
);

app.use(globalErrorHandler);

app.listen(PORT, () =>
  console.log(`SERVER STARTED ON http://localhost:${PORT}`)
);
