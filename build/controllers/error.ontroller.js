"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandling_service_1 = require("src/services/errorHandling.service");
const handleInvalidForeignKeyError = (err) => {
    const message = `Invalid foreign key constraint: ${err.sqlMessage}`;
    return new errorHandling_service_1.AppError(message, 400);
};
const handleDuplicateErrorInDB = (err) => {
    var _a, _b;
    const value = (_b = (_a = err.sqlMessage) === null || _a === void 0 ? void 0 : _a.match(/Duplicate entry '(.+?)'/)) === null || _b === void 0 ? void 0 : _b[1];
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new errorHandling_service_1.AppError(message, 400);
};
const handleValidationErrorInDB = (err) => {
    const message = `Validation failed: ${err.message}. Please provide correct data.`;
    return new errorHandling_service_1.AppError(message, 400);
};
const handleJsonWebTokenError = () => {
    return new errorHandling_service_1.AppError("Invalid token, Please provide a valid token. Please login again!", 401);
};
const handleTokenExpiredError = () => {
    return new errorHandling_service_1.AppError("Token expired. Please login again.", 401);
};
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode || 500).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode || 500).json({
                status: err.status,
                message: err.message,
            });
        }
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};
exports.default = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let err = Object.assign({}, error);
        err.message = error.message;
        // MySQL error handling
        if (err.code === "ER_DUP_ENTRY")
            err = handleDuplicateErrorInDB(err);
        if (err.code === "ER_NO_REFERENCED_ROW_2")
            err = handleInvalidForeignKeyError(err);
        if (err.code === "ER_ROW_IS_REFERENCED_2")
            err = handleInvalidForeignKeyError(err);
        if (err.name === "JsonWebTokenError")
            err = handleJsonWebTokenError();
        if (err.name === "TokenExpiredError")
            err = handleTokenExpiredError();
        sendErrorProd(err, req, res);
    }
};
