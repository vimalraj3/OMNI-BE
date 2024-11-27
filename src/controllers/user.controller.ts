import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsyncHandler";
import { User } from "../entities/user.entity";
import { dataSource } from "../configs/dataSource";

const userRepository = dataSource.getRepository(User);

export default userRepository;

export const userRegister = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  return res.send(userRepository.find());
});

export const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.send("User Login");
});