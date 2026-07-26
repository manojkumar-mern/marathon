import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.js";
import { registerValidation, loginValidation } from "../validations/auth.js";
import { authenticateUser } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", authenticateUser, getMe);

export default router;
