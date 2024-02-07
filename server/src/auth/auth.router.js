import express from 'express';

import authController from './auth.controller.js';

const router = express.Router();

router.post("/signup", authController.signup );

router.post("/login", authController.login );

router.get("/verify", authController.verify )

router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "User logged out" });
})

router.post("/recovery", authController.forgotPassword );

router.post("/validate-recovery-code", authController.validateRecoveryCode );

router.post("/password-change", authController.passwordChange );

export default router;
