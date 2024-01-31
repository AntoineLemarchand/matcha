import express from 'express';
import userController from './user.controller.js';
import imageUpload from '../multer/upload.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get("/", async (req, res) => {
  const id = jwt.verify(req.cookies.token ?? '', process.env.JWT_SECRET).id;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  await userController.getAll(id, res);
});

router.get("/propositions", async (req, res) => {
  const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET).id;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  await userController.getPropositions(id, res);
});

router.get("/:id", async (req, res) => {
  if (!req.cookies.token) return res.status(401).json({ message: "Unauthorized" });
  const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET).id;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  await userController.getById(req, res);
});

router.put("/:id", imageUpload, async (req, res) => {
  const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET).id;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  try {
    const images = req.files;
    for (const i in images) {
      if (images[i]) {
        req.body['image_' + i] = `/images/${images[i].filename}`;
      }
    }
    delete req.body['uploadedImages'];
    await userController.update(req, res);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
