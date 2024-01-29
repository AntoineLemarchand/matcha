import express from 'express';
import userController from './user.controller.js';
import imageUpload from '../multer/upload.js';


const router = express.Router();

router.get("/", async (req, res) => {
  await userController.getAll(req, res);
});

router.get("/:id", async (req, res) => {
  await userController.getById(req, res);
});

router.put("/:id", imageUpload, async (req, res) => {
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
