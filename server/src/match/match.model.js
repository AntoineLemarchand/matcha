import db from '../db.js';

export default class Match {
  constructor() {}

  static async getForUser(userId) {
    const sql = `SELECT * FROM matches WHERE user_id = ?`;
    const params = [userId];
    try {
      const result = await db.query(sql, params);
      const ret = result[0];
      return ret;
    } catch (error) {
      throw error;
    }
  }

  static async hasMatched(userId, otherUserId) {
    const sql = `SELECT * FROM matches
      WHERE user_id = ? AND match_id = ?
      OR user_id = ? AND match_id = ?`
    const params = [userId, otherUserId, otherUserId, userId];
      try {
        const result = await db.query(sql, params);
        const ret = result[0];
        return ret;
      } catch (error) {
        throw error;
      }
    }
}
