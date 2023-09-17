import express from 'express';
import db from '../db/conn.mjs';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let collection = db.collection("user");
    let results = await collection.find({}).toArray();

    res.send(results);
  } catch (err) {
    throw new Error(err);
  }
});

export default router;
