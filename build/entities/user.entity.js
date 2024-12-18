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
exports.User = exports.UserRank = void 0;
const typeorm_1 = require("typeorm");
const earnings_entity_1 = require("./earnings.entity");
const investment_entity_1 = require("./investment.entity");
var UserRank;
(function (UserRank) {
    UserRank["USER"] = "us";
    UserRank["ASSOCIATE_GROUP_LEADER"] = "agl";
    UserRank["GROUP_LEADER"] = "gl";
    UserRank["ASSOCIATE_MASTER_LEADER"] = "aml";
    UserRank["MASTER_LEADER"] = "ml";
    UserRank["ASSOCIATE_LEADING_LEADER"] = "all";
    UserRank["LEADING_LEADER"] = "ll";
    UserRank["CROWN_LEADER"] = "cl";
    UserRank["PRINCE_OF_OMNI_STOCK"] = "pos";
})(UserRank || (exports.UserRank = UserRank = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "hasActiveInvestment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastIpAdress", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, (user) => user.referrers),
    __metadata("design:type", User)
], User.prototype, "referredBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => User, (user) => user.referredBy),
    __metadata("design:type", Array)
], User.prototype, "referrers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "accountActivated", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: UserRank, default: UserRank.USER }),
    __metadata("design:type", String)
], User.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "referralCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, default: "0.00" }),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, default: "0.00" }),
    __metadata("design:type", Number)
], User.prototype, "tradingBalance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, default: "0.00" }),
    __metadata("design:type", Number)
], User.prototype, "claimable", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "user" }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["blocked", "deleted", "active"], default: "active" }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => earnings_entity_1.Earning, (earning) => earning.user),
    __metadata("design:type", Array)
], User.prototype, "earningsHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => investment_entity_1.Investment, (investment) => investment.investor),
    __metadata("design:type", Array)
], User.prototype, "investments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "verificationToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "verificationTokenExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
