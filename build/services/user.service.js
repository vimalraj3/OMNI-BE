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
exports.UserService = void 0;
const user_entity_1 = require("../entities/user.entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    generateAuthToken(user) {
        // console.log("user", user);
        const tokenPayload = { email: user.email, id: user.id };
        const secretKey = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign(tokenPayload, secretKey, { expiresIn: process.env.JWT_EXPIRES_IN });
        return token;
    }
    createReferralCode() {
        return Math.floor(Math.random() * 90000000000 + 10000000000).toString();
    }
    // ============== HASH PASSWORD ============== //
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, 10);
        });
    }
    // ============== COMPARE PASSWORD ============== //
    comparePassword(plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(plainPassword, hashedPassword);
        });
    }
    // ================ REWARD BY RANK ======================= //
    rewardByRank(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let reward = 0;
            // =============== REWARD FOR PRINCE_OF_OMNI_STOCK ============= //
            if (user.rank == user_entity_1.UserRank.PRINCE_OF_OMNI_STOCK)
                return reward = 100;
            return reward;
        });
    }
    // =================== CALCULATE ALL USER'S REFERRALS ====================== //
    // async allUserReferrals(theUser: User) {
    //   const getAllReferrers = async (theUser: User, generation: number): Promise<User[]> => {
    //     if (generation > 15) return []; // Stop at the 15th generation
    //     const currentUser = await this.userRepository.findOne({
    //       where: { id: theUser.id },
    //       relations: ["referrers"],
    //     });
    //     if (!currentUser || !currentUser.referrers) return [];  
    //     let allReferrers = [...currentUser.referrers];  
    //     for (const referrer of currentUser.referrers) {
    //       const nestedReferrers = await getAllReferrers(referrer, generation + 1);
    //       allReferrers = [...allReferrers, ...nestedReferrers];
    //     }  
    //     return allReferrers;
    //   };
    //   const user = await this.userRepository.findOne({
    //     where: { id: theUser.id },
    //     relations: ["referrers"],
    //   });  
    //   if (!user) return next(new AppError("User not found", 404));  
    //   const allReferrers = await getAllReferrers(user, 1);
    // }
    // =================== ASSIGNING RANK ======================= //
    asignUserRanks(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // ======================= CHECKING FOR RANK CRITERIAS ====================== //
            // TODO: check team stake
            // TODO: CHECK FOR AT LEAST FIVE USER'S REFERRALS WITH MINIMUM STATKE OF 200K
            const staked = user.investments.reduce((amount, staker) => amount + staker.amount, 0);
            if (staked >= 10000)
                user.rank == user_entity_1.UserRank.PRINCE_OF_OMNI_STOCK;
            else if (staked) { }
        });
    }
}
exports.UserService = UserService;
