// routes/auth.routes.js
import express from "express";
import { userSignup } from "../controllers/userSignup.controller.js";
import { userLogout } from "../controllers/logout.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { userLogin } from "../controllers/loginuser.controller.js";
import { isAuth } from "../controllers/isAuth.controller.js";

const router = express.Router();

// POST → /api/auth/signup
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/logout", authMiddleware, userLogout);
router.post("/isAuth", authMiddleware, isAuth);

export default router;
