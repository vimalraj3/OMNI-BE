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
exports.Investment = exports.InvestmentType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var InvestmentType;
(function (InvestmentType) {
    InvestmentType["ACCOUNT_ACTIVATION"] = "account-activation";
    InvestmentType["INVESTMENT"] = "investment";
})(InvestmentType || (exports.InvestmentType = InvestmentType = {}));
let Investment = class Investment {
};
exports.Investment = Investment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Investment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Investment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Investment.prototype, "expired", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: InvestmentType }),
    __metadata("design:type", String)
], Investment.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, default: "0.00" }),
    __metadata("design:type", Number)
], Investment.prototype, "amountReturned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 4, default: "0.00" }),
    __metadata("design:type", Number)
], Investment.prototype, "availableAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.investments),
    __metadata("design:type", user_entity_1.User)
], Investment.prototype, "investor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Investment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Investment.prototype, "updatedAt", void 0);
exports.Investment = Investment = __decorate([
    (0, typeorm_1.Entity)("investments")
], Investment);
