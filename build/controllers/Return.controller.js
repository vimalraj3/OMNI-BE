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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnController = void 0;
const errorHandling_service_1 = require("../services/errorHandling.service");
class ReturnController {
    constructor(userRepository, returnRepository) {
        this.userRepository = userRepository;
        this.returnRepository = returnRepository;
    }
    getLastAddedReturn() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.returnRepository.findOne({
                order: {
                    createdAt: "DESC",
                },
            });
        });
    }
    createReturn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount } = req.body;
            if (!amount)
                return next(new errorHandling_service_1.AppError("Amount is required", 400));
            const theUser = req.user;
            if (!theUser)
                return next(new errorHandling_service_1.AppError("User not found", 404));
            const user = yield this.userRepository.findOne({
                where: { email: theUser.email },
            });
            if (!user)
                return next(new errorHandling_service_1.AppError("User not found", 404));
            if (user.status !== "admin")
                return next(new errorHandling_service_1.AppError("You are not allowed to perform this operation", 401));
            const newReturn = this.returnRepository.create({
                amount,
                updateUser: user,
            });
            yield this.returnRepository.save(newReturn);
            res.status(201).json({
                status: "success",
                message: "Return created successfully",
            });
        });
    }
}
exports.ReturnController = ReturnController;
