// src/routes/index.ts
import { Router } from "express";
import authRouter from "../modules/authServices/routes";

const router = Router();

router.use("/auth", authRouter);

export default router;