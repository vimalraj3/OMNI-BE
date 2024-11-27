import { Router } from "express";
import { validateRequest } from "../middlewares/validator.middleware";
import { createUserSchema, loginUserSchema } from "../schema/user.validatorSchema";
import { userLogin, userRegister } from "../controllers/user.controller";
const router = Router();

router.get("/register", validateRequest(createUserSchema), userRegister);
router.post("/login", validateRequest(loginUserSchema), userLogin);

export default router