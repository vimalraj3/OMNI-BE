import { Router } from "express";
import { validateRequest } from "../middlewares/validator.middleware";
import {
  createUserSchema,
  loginUserSchema,
} from "../schema/user.validatorSchema";
import {
  userLogin,
  userRegister,
  verifyUser,
} from "../controllers/user.controller";
const router = Router();

router.post("/register", validateRequest(createUserSchema), userRegister);
router.post("/login", validateRequest(loginUserSchema), userLogin);
router.get("/verifyUser/:token", verifyUser);

export default router;
// https://github.com/GABRIELOFGOD/OMNI-BE