import express, { NextFunction, Request, Response } from 'express';
import { config } from 'dotenv';
import { AppError, globalErrorHandler } from './services/errorHandling.service';
import userRoutes from "./routes/user.route";
import dbConfig from './configs/database.config';
import { dataSource } from './configs/dataSource';

// ========== CONFIGURATIONS ========== //
config();
const app = express();
const PORT = process.env.PORT || 5000;
dbConfig();

// ========== ROUTES ========== //
app.all("/", (req: Request, res: Response) => res.send("HELLO FROM OMNISTOCK SERVER"));

dataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
}).catch((err) => {
  console.error('Error during Data Source initialization', err);
});

app.use("/api/v2/user", userRoutes);

// ========== ERROR HANDLING ========== //
app.all("*", (req: Request, res: Response, next: NextFunction) => next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)));
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`SERVER STARTED ON http://localhost:${PORT}`));
