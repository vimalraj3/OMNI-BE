// src/middlewares/auth.middleware.ts
import { NextFunction, Response } from "express";
import * as jwt from 'jsonwebtoken';
import {  config } from 'dotenv';
import { Request } from "../@types/custom";
import catchAsync from "../utils/catchAsyncHandler";
import { AppError } from "../services/errorHandling.service";

config();

const authMiddleware = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  // console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    // console.error("Authorization header is missing.");
    return next(new AppError('Unauthorized: Missing Authorization header', 401));
  }

  const tokenParts = authHeader.split(' ');
  // console.log("Token Parts:", tokenParts);

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    // console.error("Invalid Authorization header format.");
    return next(new AppError('Unauthorized: Invalid Authorization header format', 401));
  }

  const token = tokenParts[1];
  // console.log("Extracted Token:", token);

  if (!token) {
    // console.error("Token is missing in the Authorization header.");
    return next(new AppError('Unauthorized: Token is missing', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err: any) {
    // console.error("JWT verification error:", err.message);
    return next(new AppError('Unauthorized: Invalid Token', 401));
  }
});

 export default authMiddleware;