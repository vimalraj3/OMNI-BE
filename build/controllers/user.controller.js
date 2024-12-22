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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const request_ip_1 = require("request-ip");
const catchAsyncHandler_1 = __importDefault(require("../utils/catchAsyncHandler"));
const validator_1 = require("validator");
const errorHandling_service_1 = require("../services/errorHandling.service");
class UserController {
    constructor(userRepository, userService, mailService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.mailService = mailService;
        this.createUser = (0, catchAsyncHandler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const createUserDto = req.body;
            const userIp = (0, request_ip_1.getClientIp)(req) || req.ip || "";
            let user = yield this.userRepository.findOne({
                where: { email: createUserDto.email }
            });
            if (user)
                return next(new errorHandling_service_1.AppError("User already exists", 400));
            // ==================== VALIDATION ==================== //
            if (!(0, validator_1.isEmail)(createUserDto.email))
                return next(new errorHandling_service_1.AppError("Invalid email", 400));
            if (!(0, validator_1.isStrongPassword)(createUserDto.password))
                return next(new errorHandling_service_1.AppError("Password is not strong enough", 400));
            if (!(0, validator_1.isMobilePhone)(createUserDto.phone))
                return next(new errorHandling_service_1.AppError("Invalid phone number", 400));
            const newUser = this.userRepository.create(createUserDto);
            newUser.phoneNumber = createUserDto.phone;
            newUser.lastIpAdress = userIp;
            newUser.referralCode = this.userService.createReferralCode();
            if (createUserDto.referralCode) {
                const referrer = yield this.userRepository.findOne({
                    where: { referralCode: createUserDto.referralCode.toUpperCase() }
                });
                if (!referrer)
                    return next(new errorHandling_service_1.AppError("Referral code is invalid", 400));
                newUser.referredBy = referrer;
            }
            // =================== HASH PASSWORD =================== //
            const hashedPassword = yield this.userService.hashPassword(createUserDto.password);
            newUser.password = hashedPassword;
            // ============= SAVE USER TO DATABASE ============= //
            yield this.userRepository.save(newUser);
            // ============== CREATE TOKEN ============== //
            const authToken = this.userService.generateAuthToken(newUser);
            // console.log("authToken", authToken);
            return res.status(201).json({ status: "User created successfully", token: authToken });
        }));
        // =================== LOGIN =================== //
        this.userLogin = (0, catchAsyncHandler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const userIp = (0, request_ip_1.getClientIp)(req) || req.ip || "";
            // ============= CHECK IF USER EXISTS ============= //
            const user = yield this.userRepository.findOne({ where: { email } });
            if (!user)
                return next(new errorHandling_service_1.AppError("Invalid email or password", 400));
            // ============= CHECK IF PASSWORD IS CORRECT ============= //
            const isPasswordCorrect = yield this.userService.comparePassword(password, user.password);
            if (!isPasswordCorrect)
                return next(new errorHandling_service_1.AppError("Invalid email or password", 400));
            // ============= UPDATE USER LAST IP ADDRESS ============= //
            if (user.lastIpAdress !== userIp) {
                this.mailService.newIpDiscoverEmail(user, userIp);
            }
            user.lastIpAdress = userIp;
            yield this.userRepository.save(user);
            // ============== CREATE TOKEN ============== //
            const authToken = this.userService.generateAuthToken(user);
            return res.status(200).json({ status: "success", message: "User logged in successfully", token: authToken });
        }));
        // =================== PROFILE =================== //
        this.userProfile = (0, catchAsyncHandler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const theUser = req.user;
            const user = yield this.userRepository.findOne({
                where: { id: theUser.id },
                relations: ["referrers", "referredBy", "investments", "earningsHistory"]
            });
            if (!user)
                return next(new errorHandling_service_1.AppError("User not found", 404));
            const { password, isVerified, lastIpAdress, verificationToken, verificationTokenExpires, hasActiveInvestment } = user, rest = __rest(user, ["password", "isVerified", "lastIpAdress", "verificationToken", "verificationTokenExpires", "hasActiveInvestment"]);
            return res.status(200).json({ status: "User profile", user: rest });
        }));
        this.totalTeamMembers = (0, catchAsyncHandler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const theUser = req.user;
            const getAllReferrers = (user, generation) => __awaiter(this, void 0, void 0, function* () {
                if (generation > 15)
                    return []; // Stop at the 15th generation
                const currentUser = yield this.userRepository.findOne({
                    where: { id: user.id },
                    relations: ["referrers"],
                });
                if (!currentUser || !currentUser.referrers)
                    return [];
                let allReferrers = [...currentUser.referrers];
                for (const referrer of currentUser.referrers) {
                    const nestedReferrers = yield getAllReferrers(referrer, generation + 1);
                    allReferrers = [...allReferrers, ...nestedReferrers];
                }
                return allReferrers;
            });
            const user = yield this.userRepository.findOne({
                where: { id: theUser.id },
                relations: ["referrers"],
            });
            if (!user)
                return next(new errorHandling_service_1.AppError("User not found", 404));
            const allReferrers = yield getAllReferrers(user, 1);
            return res.status(200).json({
                status: "success",
                totalTeamMembers: allReferrers.length,
                referrers: allReferrers,
            });
        }));
    }
}
exports.UserController = UserController;
