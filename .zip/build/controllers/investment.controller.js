"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentController = void 0;
const catchAsyncHandler_1 = __importDefault(require("../utils/catchAsyncHandler"));
const errorHandling_service_1 = require("../services/errorHandling.service");
const investment_entity_1 = require("../entities/investment.entity");
const node_cron_1 = __importDefault(require("node-cron"));
class InvestmentController {
    constructor(investmentService, userRepository, investmentRepository, earningHistoryRepository, returnService) {
        this.investmentService = investmentService;
        this.userRepository = userRepository;
        this.investmentRepository = investmentRepository;
        this.earningHistoryRepository = earningHistoryRepository;
        this.returnService = returnService;
        this.isRunning = false;
        this.createInvestment = (0, catchAsyncHandler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { amount } = req.body;
            // ============== VALIDATE REQUEST ============== //
            if (!amount)
                return next(new errorHandling_service_1.AppError("Amount is required", 400));
            // ====================== GET USER ====================== //
            const reqUser = req.user;
            if (!reqUser)
                return next(new errorHandling_service_1.AppError("User not found", 400));
            // ========================= FIND USER ========================= //
            const user = yield this.userRepository.findOne({
                where: { email: reqUser.email }
            });
            if (!user)
                return next(new errorHandling_service_1.AppError("User not found", 400));
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
            const savedInvestment = yield this.investmentRepository.save(newInvestment);
            user.hasActiveInvestment = true;
            const savedUser = yield this.userRepository.save(user);
            // ===================== RETURN RESPONSE ===================== //
            res.status(201).json({
                status: "success",
                message: `You have successfully invested ${amount}`,
            });
        }));
        this.activateAccount = (0, catchAsyncHandler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { amount } = req.body;
            if (!amount || amount < 20)
                return next(new errorHandling_service_1.AppError("Account activation requires $20 deposit", 400));
            const reqUser = req.user;
            if (!reqUser)
                return next(new errorHandling_service_1.AppError("User not found", 400));
            const user = yield this.userRepository.findOne({
                where: { email: reqUser.email },
                relations: ["investments"]
            });
            if (!user)
                return next(new errorHandling_service_1.AppError("User not found", 400));
            if (user.accountActivated)
                return next(new errorHandling_service_1.AppError("Account already activated", 400));
            // ======================= ONE DOLLAR MAGIC ======================= //
            const oneDollarMagic = yield this.investmentService.oneDollarMagic(user);
            if (!oneDollarMagic)
                return next(new errorHandling_service_1.AppError("Failed to activate account", 400));
            // ======================= CREATE NEW INVESTMENT ======================= //
            const newInvestment = this.investmentRepository.create({
                amount,
                investor: user,
                type: investment_entity_1.InvestmentType.ACCOUNT_ACTIVATION
            });
            // ======================= SAVE NEW INVESTMENT ======================= //
            const saveNewInvestment = yield this.investmentRepository.save(newInvestment);
            user.investments && user.investments.push(saveNewInvestment);
            user.accountActivated = true;
            yield this.userRepository.save(user);
            res.status(200).json({
                status: "success",
                message: "Account activated successfully",
            });
        }));
        this.autoExecute();
    }
    autoExecute() {
        node_cron_1.default.schedule('0 * * * *', () => __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning) {
                console.log("Skipped execution: getInvestmentRoi is already running");
                return;
            }
            this.isRunning = true; // Acquire the "lock"
            try {
                console.log("Running getInvestmentRoi...");
                const investments = yield this.investmentRepository.find();
                for (const theInvestment of investments) {
                    const investment = yield this.investmentRepository.findOne({
                        where: { id: theInvestment.id },
                        relations: ["investor", "investor.earningsHistory"],
                    });
                    if (!investment || investment.expired || investment.type === investment_entity_1.InvestmentType.ACCOUNT_ACTIVATION || investment.amountReturned >= investment.amount * 3) {
                        continue;
                    }
                    const lastRate = yield this.returnService.getLastAddedReturn();
                    console.log("lastRate", lastRate);
                }
                console.log("getInvestmentRoi completed successfully");
            }
            catch (error) {
                console.error("Error in getInvestmentRoi:", error);
                // Optionally, you can add a retry or notification mechanism here
            }
            finally {
                this.isRunning = false; // Release the "lock"
            }
        }));
    }
}
exports.InvestmentController = InvestmentController;
