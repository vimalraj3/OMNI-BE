class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errorCode?: string | number;
  sqlMessage?: string;

  constructor(
    message: string,
    statusCode: number,
    errorCode?: string | number,
    sqlMessage?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errorCode = errorCode;
    this.sqlMessage = sqlMessage;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
