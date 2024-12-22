"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const errorHandling_service_1 = require("../services/errorHandling.service");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map((detail) => detail.message).join(", ");
            return next(new errorHandling_service_1.AppError(message, 400));
        }
        next();
    };
};
exports.validateRequest = validateRequest;
