import { NextFunction, Response } from "express";
import { Request } from "../@types/custom";
import { Return } from "../entities/return.entity";
import { Repository } from "typeorm";
import { AppError } from "../services/errorHandling.service";
import { User } from "../entities/user.entity";

export class ReturnController {
  constructor (
      private readonly userRepository: Repository<User>,
      private readonly returnRepository: Repository<Return>
  ) {}

  async getLastAddedReturn(): Promise<Return | null> {
    return this.returnRepository.findOne({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async createReturn(req: Request, res: Response, next: NextFunction) {
    const { amount } = req.body;
    if (!amount) return next(new AppError("Amount is required", 400));
    
    const theUser = req.user;
    if (!theUser) return next(new AppError("User not found", 404));

    const user = await this.userRepository.findOne({
      where: { email: theUser.email },
    });

    if (!user) return next(new AppError("User not found", 404));

    if (user.status !== "admin") return next(new AppError("You are not allowed to perform this operation", 401));
    
    const newReturn = this.returnRepository.create({
      amount,
      updateUser: user,
    });

    await this.returnRepository.save(newReturn);

    res.status(201).json({
      status: "success",
      message: "Return created successfully",
    });
  }
  
}