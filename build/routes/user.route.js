"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const user_validatorSchema_1 = require("../schema/user.validatorSchema");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_service_1 = require("../services/user.service");
const user_entity_1 = require("../entities/user.entity");
const dataSource_1 = require("../configs/dataSource");
const user_controller_1 = require("../controllers/user.controller");
const mail_service_1 = require("../services/mail.service");
const router = (0, express_1.Router)();
let userRepository = dataSource_1.dataSource.getRepository(user_entity_1.User);
let userService = new user_service_1.UserService(userRepository);
let mailService = new mail_service_1.MailService();
let userController = new user_controller_1.UserController(userRepository, userService, mailService);
router.post("/register", (0, validator_middleware_1.validateRequest)(user_validatorSchema_1.createUserSchema), userController.createUser);
router.post("/login", (0, validator_middleware_1.validateRequest)(user_validatorSchema_1.loginUserSchema), userController.userLogin);
// router.get("/verifyUser/:token", verifyUser);
router.use(auth_middleware_1.default);
router.get("/profile", userController.userProfile);
router.get("/team", userController.totalTeamMembers);
exports.default = router;
// https://github.com/GABRIELOFGOD/OMNI-BE
