"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Earning = exports.EarningType = exports.EarningStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var EarningStatus;
(function (EarningStatus) {
    EarningStatus["CLAIMED"] = "claimed";
    EarningStatus["PENDING"] = "pending";
    EarningStatus["EXPIRED"] = "expired";
})(EarningStatus || (exports.EarningStatus = EarningStatus = {}));
var EarningType;
(function (EarningType) {
    EarningType["ONE_DOLLAR_MAGIC"] = "one-dollar-magic";
    EarningType["SIX_DOLLAR_MAGIC"] = "six-dollar-magic";
    EarningType["ROI"] = "roi";
    EarningType["REF_COMMISSION"] = "ref-commission";
    EarningType["REFERRAL_BONUS"] = "referral-bonus";
})(EarningType || (exports.EarningType = EarningType = {}));
let Earning = class Earning {
};
exports.Earning = Earning;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Earning.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.earningsHistory),
    __metadata("design:type", user_entity_1.User)
], Earning.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4 }),
    __metadata("design:type", Number)
], Earning.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: EarningType }),
    __metadata("design:type", String)
], Earning.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Earning.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Earning.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: EarningStatus, default: EarningStatus.PENDING }),
    __metadata("design:type", String)
], Earning.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Earning.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Earning.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Earning.prototype, "updatedAt", void 0);
exports.Earning = Earning = __decorate([
    (0, typeorm_1.Entity)("earnings")
], Earning);
