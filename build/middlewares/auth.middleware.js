"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jwt = __importStar(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const catchAsyncHandler_1 = __importDefault(require("../utils/catchAsyncHandler"));
const errorHandling_service_1 = require("../services/errorHandling.service");
(0, dotenv_1.config)();
const authMiddleware = (0, catchAsyncHandler_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    // console.log("Authorization Header:", authHeader);
    if (!authHeader) {
        // console.error("Authorization header is missing.");
        return next(new errorHandling_service_1.AppError('Unauthorized: Missing Authorization header', 401));
    }
    const tokenParts = authHeader.split(' ');
    // console.log("Token Parts:", tokenParts);
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        // console.error("Invalid Authorization header format.");
        return next(new errorHandling_service_1.AppError('Unauthorized: Invalid Authorization header format', 401));
    }
    const token = tokenParts[1];
    // console.log("Extracted Token:", token);
    if (!token) {
        // console.error("Token is missing in the Authorization header.");
        return next(new errorHandling_service_1.AppError('Unauthorized: Token is missing', 401));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        // console.error("JWT verification error:", err.message);
        return next(new errorHandling_service_1.AppError('Unauthorized: Invalid Token', 401));
    }
}));
exports.default = authMiddleware;
