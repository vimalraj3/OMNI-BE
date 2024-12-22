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
exports.InvestmentService = void 0;
const earnings_entity_1 = require("../entities/earnings.entity");
class InvestmentService {
    constructor(userRepository, earningHistoryRepository) {
        this.userRepository = userRepository;
        this.earningHistoryRepository = earningHistoryRepository;
        this.oneDollarMagic = (user) => __awaiter(this, void 0, void 0, function* () {
            try {
                const amountoBeDistributed = 20;
                // ================= GIVE DIRECT REFERRAL BONUS OF $6 ================= //
                const directReferral = yield this.userRepository.findOne({
                    where: { id: user.referredBy.id },
                    relations: ["earningsHistory"]
                });
                if (!directReferral)
                    return false;
                directReferral.claimable += 6;
                const directReferralEarning = this.earningHistoryRepository.create({
                    amount: 6,
                    user: directReferral,
                    type: earnings_entity_1.EarningType.SIX_DOLLAR_MAGIC,
                    description: "Direct referral bonus",
                });
                const newUserEarning = yield this.earningHistoryRepository.save(directReferralEarning);
                directReferral.earningsHistory && directReferral.earningsHistory.push(newUserEarning);
                yield this.userRepository.save(directReferral);
                // ================= GIVE INDIRECT REFERRAL BONUS OF $1 ================= //
                let referrer = directReferral.referredBy;
                for (let i = 0; i < 14; i++) {
                    if (!referrer)
                        break;
                    referrer.claimable += 1;
                    const referrerEarning = this.earningHistoryRepository.create({
                        amount: 1,
                        user: referrer,
                        type: earnings_entity_1.EarningType.ONE_DOLLAR_MAGIC,
                        description: "Indirect referral bonus",
                    });
                    const newReferrerEarning = yield this.earningHistoryRepository.save(referrerEarning);
                    referrer.earningsHistory && referrer.earningsHistory.push(newReferrerEarning);
                    yield this.userRepository.save(referrer);
                    referrer = referrer.referredBy;
                }
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    calculateInvestmentRoi(amount) {
        let roi = 0;
        roi = amount * 0.0055;
        return roi;
    }
    calculateReferralBonus(user_1, generation_1) {
        return __awaiter(this, arguments, void 0, function* (user, generation, visited = new Set()) {
            if (generation > 15)
                return 0; // Stop recursion after the 15th generation.
            // Prevent circular references by checking the visited set.
            if (visited.has(user.email))
                return 0;
            visited.add(user.email);
            // Preload user data with all necessary relations.
            const theUser = yield this.userRepository.findOne({
                where: { email: user.email },
                relations: [
                    "investments",
                    "referrers",
                    "referrers.investments",
                    "earningsHistory",
                    "referrers.referrers",
                ],
            });
            if (!theUser)
                return 0;
            const referrals = theUser.referrers;
            let bonus = 0;
            // Bonus percentages for each generation.
            const bonusPercentages = {
                1: 0.18,
                2: 0.12,
                3: 0.1,
                4: 0.05,
                5: 0.03,
                6: 0.02,
                7: 0.01,
                8: 0.01,
                9: 0.01,
                10: 0.01,
                11: 0.01,
                12: 0.005,
                13: 0.005,
                14: 0.005,
                15: 0.005,
            };
            const bonusPercentage = bonusPercentages[generation] || 0;
            for (const theReferral of referrals) {
                const referral = yield this.userRepository.findOne({
                    where: { email: theReferral.email },
                    relations: [
                        "investments",
                        "referrers",
                        "referrers.investments",
                        "earningsHistory",
                        "referrers.referrers",
                    ],
                });
                if (!referral)
                    continue;
                // Calculate total investment for the referral.
                const referralTotalInvestment = referral.investments.reduce((sum, investment) => sum + investment.amount, 0);
                // Calculate daily earnings based on total investment.
                const referralDailyEarnings = referralTotalInvestment * 0.0055;
                // Calculate bonus for the current generation.
                bonus += referralDailyEarnings * bonusPercentage;
                // Recursive call for the next generation.
                if (referral.referrers && referral.referrers.length > 0) {
                    bonus += yield this.calculateReferralBonus(referral, generation + 1, visited);
                }
            }
            return bonus;
        });
    }
}
exports.InvestmentService = InvestmentService;
