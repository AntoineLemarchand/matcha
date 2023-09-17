import express from 'express';
import db from '../db/conn.mjs';

const router = express.Router();

router.get("/", async (res) => {
  try {
    let collection = db.collection("user");
    let results = await collection.find({}).toArray();

    res.send(results);
  } finally {
    await client.close();
  }
});

export default router;
