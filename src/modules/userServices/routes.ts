// src/modules/userServices/routes.ts
// src/modules/authServices/routes.ts

import { Router } from "express";
import { UserController } from "./controller";
 
import { validate } from "../../common/middleware";
import { authenticate } from "../../common/middleware/auth.middleware";

const authRouter = Router();
const userController = new UserController();

 
export default authRouter;
