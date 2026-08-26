import { Router } from "express";

import {
  signupController,
  loginController,
} from "../controller/auth.controller.ts";

import { authenticate } from "../../../middleware/auth.middleware.ts";

const router = Router();

router.post("/signup", signupController);

router.post("/login", loginController);

router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.userId,
  });
});




export default router;
