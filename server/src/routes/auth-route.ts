import { Router } from "express";
import { getMe, Login } from "../controllers/auth-controller";
import verifyJWT from "../middlewares/auth-middlewares";

const router = Router();

// lOGIN USER || POST
router.post("/login", Login);

router.get("/me", verifyJWT, getMe);

export default router;
