import express from 'express';
import conn from '../db/conn.mjs';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let results = conn.query("SELECT * FROM users");

    res.send(results);
  } catch (err) {
    throw new Error(err);
  }
});

export default router;