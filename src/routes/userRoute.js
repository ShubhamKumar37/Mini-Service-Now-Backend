import { Router } from "express";
import { userController } from "../controllers/index.js";
import { validate } from "../validators/validate.js";
import { signupSchema, loginSchema, resetPasswordSchema, otpSchema } from "../validators/userSchema.js";
import { authMiddleware as auth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", validate(signupSchema), userController.createUser);
router.post("/login", validate(loginSchema), userController.loginUser);
router.post("/renew-access-token", auth, userController.renewAccessToken);
router.post("/reset-password", validate(resetPasswordSchema), userController.resetPassword);
router.post("/send-otp/reset-password", validate(otpSchema), userController.sendOtpResetPassword);
router.post("/send-otp/signup", validate(otpSchema), userController.sendOtpSignUp);


export default router;