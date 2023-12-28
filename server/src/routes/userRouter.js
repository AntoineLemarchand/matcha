import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get("/", async (req, res) => {
  await userController.getAll(req, res);
});

router.get("/:id", async (req, res) => {
  await userController.getById(req, res);
});

router.put("/:id", async (req, res) => {
  await userController.update(req, res);
});

export default router;