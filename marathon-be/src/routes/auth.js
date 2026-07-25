import { Router } from "express";
import { register, login } from "../controllers/auth.js";
import { registerValidation, loginValidation } from "../validations/auth.js";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

export default router;
