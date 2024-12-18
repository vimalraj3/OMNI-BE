import catchAsync from "../utils/catchAsyncHandler";
import { InvestmentService } from "../services/investment.service";
import { Request } from "../@types/custom";
import { NextFunction, Response } from "express";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { AppError } from "../services/errorHandling.service";
import { Investment, InvestmentType } from "../entities/investment.entity";
import cron from "node-cron";
import { Earning, EarningType } from "../entities/earnings.entity";
import { Return } from "../entities/return.entity";
import { ReturnController } from "./Return.controller";

export class InvestmentController {
  private isRunning = false;
  constructor(
    private readonly investmentService: InvestmentService,
    private readonly userRepository: Repository<User>,
    private readonly investmentRepository: Repository<Investment>,
    private readonly earningHistoryRepository: Repository<Earning>,
    private readonly returnService: ReturnController,
  ) {
    this.autoExecute();
  }

  private autoExecute() {
    cron.schedule('0 * * * *', async () => {
      if (this.isRunning) {
        console.log("Skipped execution: getInvestmentRoi is already running");
        return;
      }
      
      this.isRunning = true;  // Acquire the "lock"

      try {
        console.log("Running getInvestmentRoi...");
        const investments = await this.investmentRepository.find();

        for (const theInvestment of investments) {
          const investment = await this.investmentRepository.findOne({
            where: { id: theInvestment.id },
            relations: ["investor", "investor.earningsHistory"],
          });

          if (!investment || investment.expired || investment.type === InvestmentType.ACCOUNT_ACTIVATION || investment.amountReturned >= investment.amount * 3) {
            continue;
          }
          
          const lastRate = await this.returnService.getLastAddedReturn();
          console.log("lastRate", lastRate);

        }
        
        console.log("getInvestmentRoi completed successfully");
      } catch (error) {
        console.error("Error in getInvestmentRoi:", error);
        // Optionally, you can add a retry or notification mechanism here
      } finally {
        this.isRunning = false;  // Release the "lock"
      }
    });
  }

  

  createInvestment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;

    // ============== VALIDATE REQUEST ============== //
    if (!amount) return next(new AppError("Amount is required", 400));

    // ====================== GET USER ====================== //
    const reqUser = req.user;
    if (!reqUser) return next(new AppError("User not found", 400));

    // ========================= FIND USER ========================= //
    const user = await this.userRepository.findOne({
        where: { email: reqUser.email }
    });

    if (!user) return next(new AppError("User not found", 400));
    
    // ============== CHECK USER ================== //
    // if(user.role !== "user" || user.accountActivated == false) return next(new AppError("You are not allowed to invest", 400));

    // TODO: Integrate payment gateway

    // ======================= CONFIRM WALLET OWNER ======================== //
    // if (user.wallet !== wallet) return next(new AppError("Sorry you cannot invest with other people's wallet", 400));

    // ======================= CREATE NEW INVESTMENT ======================= //
    const newInvestment = this.investmentRepository.create({
        amount,
        investor: user
    });

    // ======================= SAVE NEW INVESTMENT ======================= //
    const savedInvestment = await this.investmentRepository.save(newInvestment);
    user.hasActiveInvestment = true;
    const savedUser = await this.userRepository.save(user);

    // ===================== RETURN RESPONSE ===================== //
    res.status(201).json({
        status: "success",
        message: `You have successfully invested ${amount}`,
    });
  });

  activateAccount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    if (!amount || amount < 20) return next(new AppError("Account activation requires $20 deposit", 400));
    
    const reqUser = req.user;
    if (!reqUser) return next(new AppError("User not found", 400));

    const user = await this.userRepository.findOne({
        where: { email: reqUser.email },
        relations: ["investments"]
    });

    if (!user) return next(new AppError("User not found", 400));

    if (user.accountActivated) return next(new AppError("Account already activated", 400));

    // ======================= ONE DOLLAR MAGIC ======================= //
    const oneDollarMagic = await this.investmentService.oneDollarMagic(user);
    if (!oneDollarMagic) return next(new AppError("Failed to activate account", 400));

    // ======================= CREATE NEW INVESTMENT ======================= //
    const newInvestment = this.investmentRepository.create({
        amount,
        investor: user,
        type: InvestmentType.ACCOUNT_ACTIVATION
    });

    // ======================= SAVE NEW INVESTMENT ======================= //
    const saveNewInvestment = await this.investmentRepository.save(newInvestment);

    user.investments && user.investments.push(saveNewInvestment);
    user.accountActivated = true;

    await this.userRepository.save(user);

    res.status(200).json({
        status: "success",
        message: "Account activated successfully",
    });
  });
}