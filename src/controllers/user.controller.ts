import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

import { MoreThan } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../entities/user.entity";
import { dataSource } from "../configs/dataSource";
import { addMinutes } from "date-fns";
import Email from "../services/email.service";
import jwt from "jsonwebtoken";
import {
  createUserSchema,
  loginUserSchema,
} from "../schema/user.validatorSchema";
import catchAsync from "../utils/catchAsyncHandler";
import { HttpStatus } from "../helper/httpsStatus";
import AppError from "../utils/appError";

const signToken = (id: number) => {
  const expiresIn = process.env.JWT_EXPIRES_IN as string;
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: isNaN(Number(expiresIn)) ? expiresIn : parseInt(expiresIn, 10),
  });
};

const createSendToken = (
  user: any,
  statusCode: HttpStatus,
  req: Request,
  res: Response
) => {
  const token = signToken(user.id);
  const cookieExpiresInDays = parseInt(
    process.env.JWT_COOKIES_EXPIRES_IN || "20",
    10
  );
  if (isNaN(cookieExpiresInDays)) {
    throw new Error(
      "Invalid JWT_COOKIES_EXPIRES_IN value in environment variables."
    );
  }
  const cookieOptions: object = {
    expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const userRepository = dataSource.getRepository(User);

export default userRepository;

// Middleware to hash password before saving
const hashPasswordMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    next();
  }
);

export const userRegister = [
  hashPasswordMiddleware,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validate `req.body` is not an array
    if (Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Invalid input format. Expected a single user object.",
      });
    }

    try {
      // Validate user input
      const { error } = createUserSchema.validate(req.body);
      if (error) {
        return res
          .status(HttpStatus.OK)
          .json({ message: error.details[0].message });
      }

      // Check if email is already registered
      const existingUser = await userRepository.findOne({
        where: { email: req.body.email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered." });
      }

      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = addMinutes(new Date(), 10);

      const clientIp =
        (typeof req.headers["x-forwarded-for"] === "string"
          ? req.headers["x-forwarded-for"].split(",")[0].trim()
          : null) || req.ip;

      const {
        firstName,
        lastName,
        email,
        password,
        country,
        city,
        address,
        phoneNumber,
        referralCode,
      } = req.body;
      const newUser: User = userRepository.create({
        firstName,
        lastName,
        email,
        password,
        country,
        city,
        address,
        phoneNumber,
        lastIpAdress: clientIp,
        referralCode,
        verificationToken,
        verificationTokenExpires,
      });

      // Save the new user to the database
      await userRepository.save(newUser);

      // // Send verification email
      // const name = `${newUser.firstName} ${newUser.lastName}`;
      const verificationUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verifyUser/${verificationToken}`;
      const emailInstance = new Email(
        { email: newUser.email, firstName: newUser.firstName },
        verificationUrl
      );
      await emailInstance.sendVerificationEmail();

      // Respond with success
      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          user: newUser,
          message: "User registered successfully. Please verify your email.",
        },
      });
    } catch (error) {
      next(error);
    }
  }),
];

export const verifyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verificationToken = req.params.token;

    // Find user by verification token and ensure token has not expired
    const user = await userRepository.findOne({
      where: {
        verificationToken,
        verificationTokenExpires: MoreThan(new Date()), // Compare with the current date
      },
    });

    // If user is not found or token expired
    if (!user) {
      return next(
        new AppError("Token is invalid or has expired", HttpStatus.BAD_REQUEST)
      );
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await userRepository.save(user);

    createSendToken(user, HttpStatus.OK, req, res);
  }
);

export const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const user = await userRepository.findOne({
      where: { email },
      select: ["id", "email", "password", "isVerified"],
    });

    if (!user) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(new AppError("Incorrect email or password", 401));
    }
    if (!user.isVerified) {
      return next(new AppError("Your account is not verified yet!", 403));
    }

    console.log(user, "this is login user");
    createSendToken(user, 200, req, res);
  }
);
