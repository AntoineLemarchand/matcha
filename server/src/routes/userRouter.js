import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get("/", async (req, res) => {
  userController.getAll(req, res);
});

export default router;