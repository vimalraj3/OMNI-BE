"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const globalErrorHandler = (err, req, res, next) => {
    // ================== SET DEFAULT ERROR VALUES ================== //
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // ================== SEND OPERATIONAL ERROR MESSAGE ================== //
    if (err instanceof AppError) {
        // ================== SEND OPERATIONAL ERROR MESSAGE ================== //
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    console.error('ERROR 💥', err);
    // ================= SEND GENERIC ERROR MESSAGE ================== //
    res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};
exports.globalErrorHandler = globalErrorHandler;
