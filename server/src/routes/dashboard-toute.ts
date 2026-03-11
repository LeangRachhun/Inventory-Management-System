import express from "express";
import { getSummary } from "../controllers/dashboard-controller";

const router = express.Router();

router.get("/", getSummary);

export default router;
