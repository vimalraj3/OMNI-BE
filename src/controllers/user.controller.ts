import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsyncHandler";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../entities/user.entity";
import { dataSource } from "../configs/dataSource";
import Email from "../services/email.service";
import {
  createUserSchema,
  loginUserSchema,
} from "../schema/user.validatorSchema";
import { HttpStatus } from "../helper/httpsStatus";
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

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Create a new user instance
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
        lastIpAdress: req.ip,
        referralCode,
        verificationToken,
      });

      // Save the new user to the database
      await userRepository.save(newUser);

      // // Send verification email
      // const name = `${newUser.firstName} ${newUser.lastName}`;
      const verificationUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify/${verificationToken}`;
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

export const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.send(userRepository.find());
  }
);

export const verifyUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const verifyToken = req.params.token;
  
  }
);
// export const userRegister = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     return res.send(userRepository.find());
//   }
// );
